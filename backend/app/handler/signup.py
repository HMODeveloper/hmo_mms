from datetime import datetime, timezone

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from app.core.logger import logger
from app.core.database import get_db
from app.model import User, College
from app.schema.signup import (
    CollegeInfo,
    CollegeListResponse,
    SignUpRequest
)


async def get_info_handler():
    colleges = []
    for college in College:
        if college == College.OTHERS:
            continue

        colleges.append(CollegeInfo(
            name=str(college.value),
            code=college.name,
        ))

    return CollegeListResponse(colleges=colleges)


async def check_qq_handler(
        qq_id: int,
        db: AsyncSession = Depends(get_db),
):
    user = (
        (await db.execute(
            select(User).where(User.qq_id == qq_id)
        ))
        .scalars().first()
    )

    if user:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "该 QQ 号已被注册",
                "code": "QQID_EXISTS"
            }
        )

    return JSONResponse(
        content={"QQID": qq_id}
    )


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


    user.password=request.password
    user.create_at=datetime.now(timezone.utc)

    try:
        db.add(user)
        await db.commit()

        return JSONResponse(content="注册成功")
    except IntegrityError as e:
        await db.rollback()

        logger.error(e)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "注册失败，填写信息有误",
                "code": "INTEGRITY_ERROR"
            }
        )
    except Exception as e:
        await db.rollback()

        logger.error(e)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "服务器内部错误，请联系管理员",
                "code": "SERVER_ERROR"
            }
        )
