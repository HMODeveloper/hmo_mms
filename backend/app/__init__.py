from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api import router
from app.core.database import async_session, init_db
from app.core.logger import logger
from app.utils import AuthMiddleware
from app.core.config import CONFIG


@asynccontextmanager
async def lifespan(app: FastAPI):
    # on_startup
    logger.info("验证配置文件中...")
    try:
        CONFIG.valid()
    except Exception as e:
        logger.error(f"配置文件验证失败: {e}")
        raise e
    logger.info("配置文件验证通过")
    await init_db()
    logger.info("数据库初始化完成")
    db = async_session()

    yield

    # on_shutdown
    await db.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="title",
        debug=True,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    app.add_middleware(AuthMiddleware)

    app.add_middleware(SessionMiddleware, secret_key=CONFIG.SECRET_KEY)

    app.include_router(router)

    @app.get("/")
    async def root():
        return {"message": "Hello World"}

    return app


if __name__ == "__main__":
    app = create_app()
