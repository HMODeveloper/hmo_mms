from datetime import timezone, datetime

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.config import CONFIG
from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, UserDepartment, College, DeletedUser
from app.schema import Response, ErrorResponse, BaseDepartment
from app.schema.member import (
    MemberListResponse,
    MemberInfoResponse,
    UpdateMemberInfoRequest,
    AddMemberRequest,
)
from app.utils import get_current_user


async def member_list_handler(
    db: AsyncSession = Depends(get_db),
) -> Response[MemberListResponse]:
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
                    BaseDepartment(
                        name=department.name,
                        code=department.code,
                    )
                )

            member_list.append(
                MemberInfoResponse(
                    qq_id=user.qq_id,
                    nickname=user.nickname,
                    mc_name=user.mc_name,
                    create_at=user.create_at.replace(tzinfo=timezone.utc),
                    real_name=user.real_name,
                    student_id=user.student_id,
                    college_name=user.college_name,
                    major=user.major,
                    grade=user.grade,
                    class_index=user.class_index,
                    departments=departments,
                    level=user.level.value,
                )
            )

        return Response(data=MemberListResponse(member_list=member_list))
    except Exception as e:
        logger.error(e)
        raise ErrorResponse()


async def add_member_handler(
    request: AddMemberRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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
        if college.name == request.college_name:
            matching_college = college
            break
    if matching_college is None:
        matching_college = College.OTHERS

    user.college_enum = matching_college
    if matching_college in (College.OTHERS, College.NOT_HNU):
        user.college_name = request.college_name
    else:
        user.college_name = str(matching_college.value)

    user.password = request.password
    user.create_at = datetime.now(timezone.utc)

    try:
        db.add(user)
        await db.commit()

        return Response()
    except IntegrityError as e:
        await db.rollback()

        logger.error(e)
        raise ErrorResponse(
            status_code=409,
            code="INTEGRITY_ERROR",
        )
    except Exception as e:
        await db.rollback()

        logger.error(e)
        raise ErrorResponse()


async def remove_member_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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
            college_enum=user.college_enum,
            college_name=user.college_name,
            major=user.major,
            grade=user.grade,
            class_index=user.class_index,
            deleted_at=datetime.now(timezone.utc),
        )

        db.add(deleted_user)

        await db.delete(user)
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def get_member_info_handler(
    qq_id: int,
    db: AsyncSession = Depends(get_db),
) -> Response[MemberInfoResponse]:
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
            BaseDepartment(
                name=department.name,
                code=department.code,
            )
        )

    member_info = MemberInfoResponse(
        qq_id=user.qq_id,
        nickname=user.nickname,
        mc_name=user.mc_name,
        create_at=user.create_at.replace(tzinfo=timezone.utc),
        real_name=user.real_name,
        student_id=user.student_id,
        college_name=user.college_name,
        major=user.major,
        grade=user.grade,
        class_index=user.class_index,
        departments=departments,
        level=user.level.value,
    )

    return Response(member_info)


async def update_member_info_handler(
    qq_id: int,
    request: UpdateMemberInfoRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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
        if request.college_name is not None:
            user.college_name = request.college_name
        if request.major is not None:
            user.major = request.major
        if request.grade is not None:
            user.grade = request.grade
        if request.class_index is not None:
            user.class_index = request.class_index

        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def reset_member_password_handler(
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
