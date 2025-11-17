from pathlib import Path

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import CONFIG
from app.core.logger import logger


SQLALCHEMY_DATABASE_URL = CONFIG.DATABASE_URL

if SQLALCHEMY_DATABASE_URL == "sqlite+aiosqlite:///./data/test.db":
    logger.info("当前使用的是测试数据库")

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    DATABASE_URL = Path(SQLALCHEMY_DATABASE_URL.split("///")[1])
    if not DATABASE_URL.parent.exists():
        DATABASE_URL.parent.mkdir(parents=True, exist_ok=True)
        print(f"已创建: {DATABASE_URL.parent}")


# 创建异步引擎
engine: AsyncEngine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,  # 连接池初始大小
    max_overflow=30,  # 连接池最大溢出连接数
    pool_timeout=30,  # 连接池超时时间
    pool_recycle=3600,  # 连接回收时间
    pool_pre_ping=True,  # 连接池预检查
    echo=False,  # 是否输出SQL日志
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


async def init_db():
    """初始化数据库"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """获取数据库会话"""
    async with async_session() as session:
        yield session

        try:
            if session.is_active:
                await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()
