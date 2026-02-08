from fastapi import Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel
from app.schema import ErrorResponse
from app.schema.superadmin import AddAdminRequest, AddSuperAdminRequest
from app.utils import get_current_user


async def add_admin_handler(
    request: AddAdminRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    user = (
        (await db.execute(select(User).where(User.qq_id == request.qq_id)))
        .scalars()
        .first()
    )

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    if user.level == UserLevel.ADMIN or user.level == UserLevel.SUPERADMIN:
        raise ErrorResponse(
            status_code=409,
            code="USER_ALREADY_ADMIN",
        )

    try:
        user.level = UserLevel.ADMIN
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def remove_admin_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    if user.level != UserLevel.ADMIN:
        raise ErrorResponse(
            status_code=409,
            code="USER_NOT_ADMIN",
        )

    try:
        user.level = UserLevel.MEMBER
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def add_superadmin_handler(
    request: AddSuperAdminRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    user = (
        (await db.execute(select(User).where(User.qq_id == request.qq_id)))
        .scalars()
        .first()
    )

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    if user.level == UserLevel.SUPERADMIN:
        raise ErrorResponse(
            status_code=409,
            code="USER_ALREADY_SUPERADMIN",
        )

    try:
        user.level = UserLevel.SUPERADMIN
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def remove_superadmin_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    if user.level != UserLevel.SUPERADMIN:
        raise ErrorResponse(
            status_code=409,
            code="USER_NOT_SUPERADMIN",
        )

    # Check if this is the last superadmin
    superadmin_count = (
        await db.execute(
            select(func.count(User.id)).where(User.level == UserLevel.SUPERADMIN)
        )
    ).scalar()

    if superadmin_count <= 1:
        raise ErrorResponse(
            status_code=400,
            code="LAST_SUPERADMIN",
        )

    try:
        user.level = UserLevel.MEMBER
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
