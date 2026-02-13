from datetime import timezone, datetime

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, UserDepartment, College, DeletedUser
from app.schema import ErrorResponse, BaseUserDepartment
from app.schema.member import (
    MemberListResponse,
    MemberInfoResponse,
    AddMemberRequest,
)
from app.utils import get_current_user


async def member_list_handler(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MemberListResponse:
    try:
        users = (
            (
                await db.execute(
                    select(User).options(
                        joinedload(User.user_departments).joinedload(
                            UserDepartment.department
                        )
                    )
                )
            )
            .unique()
            .scalars()
            .all()
        )

        member_list = []
        for user in users:
            departments = []
            for department in user.departments:
                departments.append(
                    BaseUserDepartment(
                        code=department.code,
                        name=department.name,
                    )
                )

            member_list.append(
                MemberInfoResponse(
                    qq_id=user.qq_id,
                    nickname=user.nickname,
                    mc_name=user.mc_name,
                    create_at=user.create_at.replace(tzinfo=timezone.utc),
                    real_name=user.real_name
                    if current_user.sensitive_permission(user)
                    else "***",
                    student_id=user.student_id
                    if current_user.sensitive_permission(user)
                    else "***",
                    college=user.college.name,
                    school=user.school,
                    major=user.major
                    if current_user.sensitive_permission(user)
                    else None,
                    grade=user.grade
                    if current_user.sensitive_permission(user)
                    else None,
                    class_index=user.class_index
                    if current_user.sensitive_permission(user)
                    else None,
                    departments=departments,
                    level=user.level.value,
                )
            )

        return member_list
    except Exception as e:
        logger.error(e)
        raise ErrorResponse()


async def add_member_handler(
    request: AddMemberRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.has_permission(UserLevel.ADMIN):
        raise ErrorResponse(
            status_code=403,
            code="ADMIN_REQUIRED",
        )

    user = User(
        qq_id=request.qq_id,
        nickname=request.nickname,
        mc_name=request.mc_name,
        real_name=request.real_name,
        student_id=request.student_id,
        major=request.major,
        grade=request.grade,
        class_index=request.class_index,
    )

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
        user.school = request.school

    user.password = request.password
    user.create_at = datetime.now(timezone.utc)

    try:
        db.add(user)
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()

        logger.error(e)
        raise ErrorResponse()


async def remove_member_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
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

    is_admin_or_minister = user.has_permission(UserLevel.ADMIN)
    if not is_admin_or_minister:
        for ud in user.user_departments:
            if ud.is_minister:
                is_admin_or_minister = True
                break

    if is_admin_or_minister:
        if not current_user.has_permission(UserLevel.SUPERADMIN):
            raise ErrorResponse(
                status_code=403,
                code="SUPERADMIN_REQUIRED",
            )
    else:
        if not current_user.has_permission(UserLevel.ADMIN):
            raise ErrorResponse(
                status_code=403,
                code="ADMIN_REQUIRED",
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
