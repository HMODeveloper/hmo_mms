import secrets
from datetime import datetime, timezone

from fastapi import Depends, Response as FastAPIResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserDepartment
from app.schema import ErrorResponse, BaseUserDepartment
from app.schema.auth import LoginRequest, UserInfoResponse
from app.utils.get_current_user import get_current_user


async def login_handler(
    request: LoginRequest,
    response: FastAPIResponse,
    db: AsyncSession = Depends(get_db),
):
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

    if not user.verify_password(request.password):
        raise ErrorResponse(
            status_code=401,
            code="INVALID_PASSWORD",
        )

    try:
        user.update_at = datetime.now(timezone.utc)
        user.token = secrets.token_hex(32)
        await db.commit()

        response.set_cookie(
            key="token",
            value=str(user.token),
            httponly=True,
            max_age=86400,
        )

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def get_user_info_handler(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserInfoResponse:
    user_with_departments = (
        (
            await db.execute(
                select(User)
                .where(User.id == user.id)
                .options(
                    joinedload(User.user_departments).joinedload(
                        UserDepartment.department
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not user_with_departments:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    departments = []
    for department in user_with_departments.departments:
        departments.append(
            BaseUserDepartment(
                code=department.code,
                name=department.name,
            )
        )

    user_info = UserInfoResponse(
        qq_id=user.qq_id,
        nickname=user.nickname,
        mc_name=user.mc_name,
        create_at=user.create_at.replace(tzinfo=timezone.utc),
        real_name=user.real_name,
        student_id=user.student_id,
        college=user.college.name,
        school=user.school,
        major=user.major,
        grade=user.grade,
        class_index=user.class_index,
        departments=departments,
        level=user.level.name,
    )

    return user_info


async def logout_handler(
    response: FastAPIResponse,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    try:
        user.token = None
        user.update_at = None
        await db.commit()

        response.delete_cookie(key="token")

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
