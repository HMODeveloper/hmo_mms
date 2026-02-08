from datetime import datetime, timedelta, timezone
from typing import Callable

from fastapi import Request, Depends
from starlette.responses import Response, JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import get_db
from app.core.config import CONFIG
from app.core.logger import logger
from app.model import User

EXCLUDE_PATHS = ["/login", "/signup", "/signup/check"]
EXCLUDE_API_PATHS = ["/api" + api for api in EXCLUDE_PATHS]


class MiddlewareResponse(JSONResponse):
    def __init__(self, status_code: int = 500, code: str = "INTERNAL_SERVER_ERROR"):
        super().__init__(status_code=status_code, content={"detail": "AUTH_" + code})


class AuthMiddleware(BaseHTTPMiddleware):
    """用户认证中间件"""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable,
        db: AsyncSession = Depends(get_db),
    ) -> Response:
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
            return MiddlewareResponse(status_code=401, code="NO_TOKEN")

        async for db in get_db():
            try:
                user = (
                    (await db.execute(select(User).where(User.token == token)))
                    .scalars()
                    .first()
                )

                if not user:
                    logger.info("认证失败: 用户不存在")
                    return MiddlewareResponse(status_code=404, code="USER_NOT_FOUND")

                if not user.update_at:
                    logger.info("认证失败: 登录已过期")
                    return MiddlewareResponse(status_code=401, code="EXPIRED")

                if user.update_at + timedelta(seconds=CONFIG.TIME_OUT) < datetime.now(
                    timezone.utc
                ):
                    logger.info("认证失败: 登录已过期")
                    return MiddlewareResponse(status_code=401, code="EXPIRED")

                user.update_at = datetime.now(timezone.utc)
                await db.commit()

                return await call_next(request)
            except Exception as e:
                logger.error(f"认证中间件异常: {e}")
                return MiddlewareResponse(status_code=500, code="INTERNAL_SERVER_ERROR")
            finally:
                await db.close()

        logger.error("数据库连接失败")
        return MiddlewareResponse(status_code=500, code="DB_CONN_FAIL")
