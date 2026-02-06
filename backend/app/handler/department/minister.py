from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.database import get_db
from app.core.logger import logger
from app.model import User, UserLevel, Department, UserDepartment
from app.schema import Response, ErrorResponse
from app.utils import get_current_user


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
