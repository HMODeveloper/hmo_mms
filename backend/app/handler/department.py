from datetime import timezone

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, Department, UserDepartment
from app.schema import Response, ErrorResponse, BaseDepartment, BaseUserInfo
from app.schema.department import (
    DepartmentListResponse,
    DepartmentMemberListResponse,
    AddDepartmentRequest,
    MinisterInfo,
    DepartmentInfo,
)
from app.utils import get_current_user


async def department_list_handler(
    db: AsyncSession = Depends(get_db),
) -> Response[DepartmentListResponse]:
    try:
        departments = (
            (
                await db.execute(
                    select(Department).options(
                        joinedload(Department.user_departments).joinedload(
                            UserDepartment.user
                        )
                    )
                )
            )
            .unique()
            .scalars()
            .all()
        )

        result = []
        for dept in departments:
            minister_list = []
            for minister in dept.ministers:
                minister_list.append(
                    MinisterInfo(
                        qq_id=minister.qq_id,
                        nickname=minister.nickname,
                        mc_name=minister.mc_name,
                    )
                )

            result.append(
                DepartmentInfo(
                    name=dept.name,
                    code=dept.code,
                    minister=minister_list,
                )
            )

        return Response(DepartmentListResponse(result))
    except Exception as e:
        logger.error(e)
        raise ErrorResponse()


async def department_member_list_handler(
    code: str,
    db: AsyncSession = Depends(get_db),
) -> Response[DepartmentMemberListResponse]:
    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    member_list = []
    for user in department.users:
        departments = []
        for dept in user.departments:
            departments.append(
                BaseDepartment(
                    name=dept.name,
                    code=dept.code,
                )
            )

        member_list.append(
            BaseUserInfo(
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

    return Response(DepartmentMemberListResponse(member_list))


async def add_department_handler(
    request: AddDepartmentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    # Check if department code exists
    existing_dept_code = (
        (await db.execute(select(Department).where(Department.code == request.code)))
        .scalars()
        .first()
    )
    if existing_dept_code:
        raise ErrorResponse(
            status_code=409,
            code="DEPT_CODE_EXISTS",
        )

    # Check if department name exists
    existing_dept_name = (
        (await db.execute(select(Department).where(Department.name == request.name)))
        .scalars()
        .first()
    )
    if existing_dept_name:
        raise ErrorResponse(
            status_code=409,
            code="DEPT_NAME_EXISTS",
        )

    # Validate ministers exist
    minister_users = []
    for qq_id in request.minister:
        user = (
            (await db.execute(select(User).where(User.qq_id == qq_id)))
            .scalars()
            .first()
        )
        if not user:
            raise ErrorResponse(
                status_code=404,
                code="MINISTER_NOT_FOUND",
            )
        minister_users.append(user)

    # Validate members exist
    member_users = []
    for qq_id in request.member:
        user = (
            (await db.execute(select(User).where(User.qq_id == qq_id)))
            .scalars()
            .first()
        )
        if not user:
            raise ErrorResponse(
                status_code=404,
                code="MEMBER_NOT_FOUND",
            )
        member_users.append(user)

    # Check if all ministers are in members
    for minister_qq in request.minister:
        if minister_qq not in request.member:
            raise ErrorResponse(
                status_code=400,
                code="MINISTER_NOT_IN_MEMBERS",
            )

    try:
        # Create department
        new_dept = Department(
            name=request.name,
            code=request.code,
        )
        db.add(new_dept)
        await db.flush()

        # Add members with minister flag
        for user in member_users:
            is_minister = user.qq_id in request.minister
            user_dept = UserDepartment(
                user_id=user.id,
                department_id=new_dept.id,
                is_minister=is_minister,
            )
            db.add(user_dept)

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


async def remove_department_handler(
    code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    if len(department.users) > 0:
        raise ErrorResponse(
            status_code=400,
            code="DEPT_NOT_EMPTY",
        )

    try:
        await db.delete(department)
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def add_department_member_handler(
    code: str,
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    # Check if current user is minister of this department or superadmin
    is_minister = any(
        ud.user_id == current_user.id and ud.is_minister
        for ud in department.user_departments
    )

    if not (current_user.has_permission(UserLevel.SUPERADMIN) or is_minister):
        raise ErrorResponse(
            status_code=403,
            code="MINISTER_REQUIRED",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    # Check if user is already in department
    if user in department.users:
        raise ErrorResponse(
            status_code=409,
            code="USER_ALREADY_IN_DEPT",
        )

    try:
        user_dept = UserDepartment(
            user_id=user.id,
            department_id=department.id,
            is_minister=False,
        )
        db.add(user_dept)
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def remove_department_member_handler(
    code: str,
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    # Check if user is in department
    if user not in department.users:
        raise ErrorResponse(
            status_code=409,
            code="USER_NOT_IN_DEPT",
        )

    # Find the UserDepartment association for this user
    user_dept_assoc = None
    for ud in department.user_departments:
        if ud.user_id == user.id:
            user_dept_assoc = ud
            break

    # Check if target user is a minister
    is_target_minister = user_dept_assoc and user_dept_assoc.is_minister

    # If removing a minister, require superadmin
    if is_target_minister:
        if not current_user.has_permission(UserLevel.SUPERADMIN):
            raise ErrorResponse(
                status_code=403,
                code="SUPERADMIN_REQUIRED",
            )
    else:
        # If removing regular member, check if current user is minister or superadmin
        is_minister = any(
            ud.user_id == current_user.id and ud.is_minister
            for ud in department.user_departments
        )

        if not (current_user.has_permission(UserLevel.SUPERADMIN) or is_minister):
            raise ErrorResponse(
                status_code=403,
                code="MINISTER_REQUIRED",
            )

    try:
        # Remove the UserDepartment association
        if user_dept_assoc:
            await db.delete(user_dept_assoc)
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def add_department_minister_handler(
    code: str,
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    # Check if user is in department and get the association
    user_dept_assoc = None
    for ud in department.user_departments:
        if ud.user_id == user.id:
            user_dept_assoc = ud
            break

    if not user_dept_assoc:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_IN_DEPT",
        )

    # Check if user is already a minister
    if user_dept_assoc.is_minister:
        raise ErrorResponse(
            status_code=409,
            code="USER_ALREADY_MINISTER",
        )

    try:
        # Update the is_minister flag
        user_dept_assoc.is_minister = True
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def remove_department_minister_handler(
    code: str,
    qq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    if not current_user.has_permission(UserLevel.SUPERADMIN):
        raise ErrorResponse(
            status_code=403,
            code="SUPERADMIN_REQUIRED",
        )

    department = (
        (
            await db.execute(
                select(Department)
                .where(Department.code == code)
                .options(
                    joinedload(Department.user_departments).joinedload(
                        UserDepartment.user
                    )
                )
            )
        )
        .unique()
        .scalars()
        .first()
    )

    if not department:
        raise ErrorResponse(
            status_code=404,
            code="DEPT_NOT_FOUND",
        )

    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_FOUND",
        )

    # Check if user is in department and get the association
    user_dept_assoc = None
    for ud in department.user_departments:
        if ud.user_id == user.id:
            user_dept_assoc = ud
            break

    if not user_dept_assoc:
        raise ErrorResponse(
            status_code=404,
            code="USER_NOT_IN_DEPT",
        )

    # Check if user is a minister
    if not user_dept_assoc.is_minister:
        raise ErrorResponse(
            status_code=409,
            code="USER_NOT_MINISTER",
        )

    try:
        # Update the is_minister flag to False
        user_dept_assoc.is_minister = False
        await db.commit()

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
