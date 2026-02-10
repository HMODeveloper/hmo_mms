from datetime import datetime, timezone

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserDepartment, UserLevel, DeletedUser, College
from app.schema import ErrorResponse
from app.schema.user import ChangePasswordRequest, UpdateUserInfoRequest
from app.utils import get_current_user


async def remove_user_handler(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
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

    is_admin_or_minister = user.has_permission(UserLevel.ADMIN)
    if not is_admin_or_minister:
        for ud in user.user_departments:
            if ud.is_minister:
                is_admin_or_minister = True
                break

    if is_admin_or_minister:
        if not user.has_permission(UserLevel.SUPERADMIN):
            raise ErrorResponse(
                status_code=403,
                code="SUPERADMIN_REQUIRED",
            )

    try:
        if user.level in (UserLevel.ADMIN, UserLevel.SUPERADMIN):
            user.level = UserLevel.MEMBER

        for ud in user.user_departments:
            if ud.is_minister:
                ud.is_minister = False

        await db.flush()

        deleted_user = DeletedUser(
            qq_id=user.qq_id,
            nickname=user.nickname,
            mc_name=user.mc_name,
            create_at=user.create_at,
            real_name=user.real_name,
            student_id=user.student_id,
            college=user.college,
            school=user.school,
            major=user.major,
            grade=user.grade,
            class_index=user.class_index,
            deleted_at=datetime.now(timezone.utc),
        )

        db.add(deleted_user)

        await db.delete(user)
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def change_password_handler(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not user.verify_password(request.old):
        raise ErrorResponse(
            status_code=403,
            code="INVALID_OLD_PASSWORD",
        )

    if request.old == request.new:
        raise ErrorResponse(
            status_code=400,
            code="SAME_AS_OLD_PASSWORD",
        )

    try:
        user.password = request.new
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def update_user_info_handler(
    request: UpdateUserInfoRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
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
