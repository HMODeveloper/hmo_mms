from datetime import datetime, timezone

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logger import logger
from app.core.database import get_db
from app.model import User, College
from app.schema import ErrorResponse
from app.schema.signup import SignUpRequest


async def check_qq_handler(
    qq_id: str,
    db: AsyncSession = Depends(get_db),
):
    user = (await db.execute(select(User).where(User.qq_id == qq_id))).scalars().first()

    if user:
        raise ErrorResponse(
            status_code=409,
            code="QQID_ALREADY_EXISTS",
        )

    return None


async def signup_handler(
    request: SignUpRequest,
    db: AsyncSession = Depends(get_db),
):
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
    else:
        user.school = None

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
