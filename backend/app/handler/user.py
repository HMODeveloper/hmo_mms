from fastapi import Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.logger import logger
from app.model import User
from app.schema import Response, ErrorResponse
from app.schema.user import ChangePasswordRequest, UpdateUserInfoRequest
from app.utils import get_current_user


async def change_password_handler(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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

        return Response()
    except Exception as e:
        await db.rollback()
        logger.error(e)
        raise ErrorResponse()


async def update_user_info_handler(
    request: UpdateUserInfoRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
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
