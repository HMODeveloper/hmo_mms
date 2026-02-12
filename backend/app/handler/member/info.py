from datetime import timezone

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.config import CONFIG
from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, UserDepartment, College
from app.schema import ErrorResponse, BaseUserDepartment
from app.schema.member import (
    MemberInfoResponse,
    UpdateMemberInfoRequest,
)
from app.utils import get_current_user


async def get_member_info_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MemberInfoResponse:
    user = (
        (
            await db.execute(
                select(User)
                .where(User.qq_id == qq_id)
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

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    departments = []
    for department in user.departments:
        departments.append(
            BaseUserDepartment(
                code=department.code,
                name=department.name,
            )
        )

    member_info = MemberInfoResponse(
        qq_id=user.qq_id,
        nickname=user.nickname,
        mc_name=user.mc_name,
        create_at=user.create_at.replace(tzinfo=timezone.utc),
        real_name=user.real_name if current_user.sensitive_permission(user) else "***",
        student_id=user.student_id
        if current_user.sensitive_permission(user)
        else "***",
        college=user.college.value,
        school=user.school,
        major=user.major if current_user.sensitive_permission(user) else None,
        grade=user.grade if current_user.sensitive_permission(user) else None,
        class_index=user.class_index
        if current_user.sensitive_permission(user)
        else None,
        departments=departments,
        level=user.level.value,
    )

    return member_info


async def update_member_info_handler(
    qq_id: int,
    request: UpdateMemberInfoRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.ADMIN):
        raise ErrorResponse(
            status_code=403,
            code="ADMIN_REQUIRED",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    try:
        if request.nickname is not None:
            user.nickname = request.nickname
        if request.password is not None:
            user.password = request.password
        if request.mc_name is not None:
            user.mc_name = request.mc_name
        if request.real_name is not None:
            user.real_name = request.real_name
        if request.student_id is not None:
            user.student_id = request.student_id
        if request.college is not None:
            matching_college = None
            for college in College:
                if college.name == request.college:
                    matching_college = college
                    break
            if matching_college is None:
                raise ErrorResponse(
                    status_code=409,
                    code="NO_COLLEGE_MATCHED",
                )
            user.college = matching_college
            if matching_college == College.NOT_HNU:
                if request.school is not None:
                    user.school = request.school
        if request.major is not None:
            user.major = request.major
        if request.grade is not None:
            user.grade = request.grade
        if request.class_index is not None:
            user.class_index = request.class_index

        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def reset_member_password_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.ADMIN):
        raise ErrorResponse(
            status_code=403,
            code="ADMIN_REQUIRED",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    try:
        user.password = CONFIG.DEFAULT_PASSWORD
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
