from datetime import datetime, timedelta, timezone
from inspect import cleandoc
from typing import Callable

from fastapi import HTTPException, Request, Depends
from starlette.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import get_db
from app.core.config import CONFIG
from app.core.logger import logger
from app.model import User

SIGNUP_PATHS = ["/signup", "/signup/info", "/signup/check_qq"]
EXCLUDE_PATHS = ["/login", *SIGNUP_PATHS]
EXCLUDE_API_PATHS = ["/api" + api for api in EXCLUDE_PATHS]


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

        # 放行文档相关路径
        if request.url.path in ["/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)

        # 放行非 API 路径
        if not request.url.path.startswith("/api"):
            return await call_next(request)

        # 放行不需要认证的 API 路径
        if request.url.path in EXCLUDE_API_PATHS:
            return await call_next(request)

        # 获取 Token
        token = request.cookies.get("token")

        # 验证 Token
        if not token:
            logger.info("认证失败: 缺少 token")
            raise HTTPException(
                status_code=401, detail={
                    "message": "认证失败: 缺少 token",
                    "code": "NO_TOKEN"
                }
            )

        async for db in get_db():
            try:
                user = (
                    (await db.execute(
                        select(User).where(User.token ==  token)
                    ))
                    .scalars().first()
                )

                if not user:
                    logger.info("认证失败: 用户不存在")
                    raise HTTPException(status_code=401, detail={
                        "message": "认证失败: 用户不存在",
                        "code": "USER_NOT_FOUND"
                    })

                if not user.update_at:
                    logger.info("认证失败: 登录已过期")
                    raise HTTPException(status_code=401, detail={
                        "message": "认证失败: 登录已过期",
                        "code": "EXPIRED"
                    })

                if user.update_at + timedelta(seconds=CONFIG.TOME_OUT) < datetime.now(timezone.utc):
                    logger.info("认证失败: 登录已过期")
                    raise HTTPException(status_code=401, detail={
                        "message": "认证失败: 登录已过期",
                        "code": "EXPIRED"
                    })

                user.update_at = datetime.now(timezone.utc)
                await db.commit()

                return await call_next(request)
            except Exception as e:
                # 把内部错误也规范成对象形式，便于前端解析
                raise HTTPException(
                    status_code=500,
                    detail={
                        "message": cleandoc(f"""
                                服务器内部错误: {e}
                                请联系管理员。
                            """),
                        "code": "SERVER_ERROR"
                    }
                )
            finally:
                await db.close()

        logger.error("数据库连接失败")
        raise HTTPException(status_code=500, detail={
            "message": "数据库连接失败",
            "code": "DB_CONN_FAIL"
        })
