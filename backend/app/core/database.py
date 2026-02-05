from pathlib import Path

from sqlalchemy import select
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

    from app.model import Department, UserLevel, College, User

    async for db in get_db():
        departments = await db.execute(select(Department))
        if not departments:
            logger.warning("检测到部门表为空，正在初始化默认部门数据...")

            default_department = Department(
                name="默认部门",
                code="default",
            )
            db.add(default_department)
            await db.commit()
            logger.info("默认部门数据初始化完成")

    async for db in get_db():
        superadmins = await db.execute(
            select(User).where(User.level == UserLevel.SUPERADMIN)
        )
        if not superadmins.scalars().first():
            logger.warning(
                "检测到超级管理员用户不存在，正在初始化默认超级管理员用户..."
            )

            default_superadmin = User(
                qq_id=0,
                nickname="超级管理员",
                real_name="超级管理员",
                college_enum=College.OTHERS,
                college_name="其他",
                level=UserLevel.SUPERADMIN,
            )
            default_superadmin.password = CONFIG.INIT_PASSWORD
            db.add(default_superadmin)
            await db.commit()
            logger.info("默认超级管理员用户初始化完成")


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
