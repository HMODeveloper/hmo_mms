from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, Department, UserDepartment
from app.schema import ErrorResponse
from app.schema.department import AddDepartmentMemberRequest
from app.utils import get_current_user


async def add_department_member_handler(
    code: str,
    request: AddDepartmentMemberRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
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
    if not (
        current_user.has_permission(UserLevel.SUPERADMIN)
        or current_user.is_minister(code)
    ):
        raise ErrorResponse(
            status_code=403,
            code="MINISTER_REQUIRED",
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

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def remove_department_member_handler(
    code: str,
    qq_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
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
        if not (
            current_user.has_permission(UserLevel.SUPERADMIN)
            or current_user.is_minister(code)
        ):
            raise ErrorResponse(
                status_code=403,
                code="MINISTER_REQUIRED",
            )

    try:
        # Remove the UserDepartment association
        if user_dept_assoc:
            await db.delete(user_dept_assoc)
        await db.commit()

        return None
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()
