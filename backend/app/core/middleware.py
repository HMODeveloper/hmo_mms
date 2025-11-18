from datetime import datetime, timezone, timedelta
from inspect import cleandoc
from typing import Callable

from fastapi import HTTPException, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import get_db
from app.core.config import CONFIG
from app.core.logger import logger
from app.model import User

EXCLUDE_API_PATHS = ["/login"]


# TODO: 修改 RedirectResponse 为 JSONResponse
class AuthMiddleware(BaseHTTPMiddleware):
    """用户认证中间件"""

    async def dispatch(
            self,
            request: Request,
            call_next: Callable,
            db: AsyncSession = Depends(get_db),
    ) -> Response:
        # 免登录模式, 取消所有验证
        if CONFIG.NO_LOGIN:
            return await call_next(request)

        if request.url.path in ["/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)

        # 放行不需要认证的 API 路径
        if request.url.path in EXCLUDE_API_PATHS:
            return await call_next(request)

        # 获取 Token 和 user_id
        user_id = request.cookies.get("user_id")
        token = request.cookies.get("token")

        # 验证 Token
        if not user_id or not token:
            logger.info("认证失败: 缺少 user_id 或 token")
            return RedirectResponse(url="/login")

        async for db in get_db():
            try:
                user = (
                    (await db.execute(
                        select(User).where(
                            User.id == user_id,
                            User.token == token,
                        )
                    ))
                    .scalars().first()
                )

                if not user:
                    logger.info("未找到该用户")
                    return RedirectResponse(url="/login")

                if not user.update_at:
                    logger.info("认证失败: 登录已过期")
                    return RedirectResponse(url="/login")

                if user.update_at + timedelta(seconds=CONFIG.TOME_OUT) < datetime.now():
                    logger.info("认证失败: 登录已过期")
                    return RedirectResponse(url="/login")

                user.update_at = datetime.now()
                await db.commit()

                return await call_next(request)
            except HTTPException as e:
                return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
            except Exception as e:
                return JSONResponse(
                    status_code=500,
                    content={
                        "detail": cleandoc(f"""
                                服务器内部错误: {e}
                                请联系管理员。
                            """)
                    },
                )
            finally:
                await db.close()

        logger.error("数据库连接失败")
        return RedirectResponse(
            url=request.url_for("exception", status_code=500, message="数据库连接失败")
        )
