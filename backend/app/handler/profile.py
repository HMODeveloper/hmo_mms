from datetime import timezone

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette.responses import JSONResponse

from app.core.database import get_db, logger
from app.utils import get_current_user
from app.model import User, College
from app.schema.profile import (
    DepartmentInfo,
    GetProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
)


async def get_info_handler(
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
):
    user_with_departments = (
        (await db.execute(
            select(User)
            .where(User.id == user.id)
            .options(joinedload(User.departments))
        ))
        .scalars().first()
    )

    department_info = []
    for department in user_with_departments.departments:
        department_info.append(
            DepartmentInfo(
                name=department.name,
                code=department.code
            )
        )

    response = GetProfileResponse(
        qq_id=user.qq_id,
        mc_name=user.mc_name,
        nickname=user.nickname,
        create_at=user.create_at.replace(tzinfo=timezone.utc),
        real_name=user.real_name,
        student_id=user.student_id,
        college_name=user.college_name,
        major=user.major,
        grade=user.grade,
        class_index=user.class_index,
        departments=department_info,
        level=user.level.value,
    )

    return JSONResponse(
        content=response,
    )


async def update_profile_handler(
        request: UpdateProfileRequest,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    if request.mc_name is not None:
        user.mc_name = request.mc_name

    if request.nickname is not None:
        if not request.nickname:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "昵称不能为空.",
                    "code": "INVALID_NICKNAME"
                }
            )

        user.nickname = request.nickname

    if request.real_name is not None:
        if not request.real_name:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "真实姓名不能为空.",
                    "code": "INVALID_REAL_NAME"
                }
            )
        user.real_name = request.real_name

    if request.student_id is not None:
        user.student_id = request.student_id
    if request.major is not None:
        user.major = request.major
    if request.grade is not None:
        user.grade = request.grade
    if request.class_index is not None:
        user.class_index = request.class_index

    # 学院枚举处理
    if request.departments is not None:
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

    try:
        await db.commit()
        return JSONResponse(content={"message": "修改成功."})
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


async def change_password_handler(
        request: ChangePasswordRequest,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
):
    if not user.verify_password(request.old_password):
        raise HTTPException(
            status_code=403,
            detail={
                "message": "旧密码错误.",
                "code": "INVALID_OLD_PASSWORD"
            }
        )

    if user.verify_password(request.new_password):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "新密码不能与旧密码相同.",
                "code": "SAME_AS_OLD_PASSWORD"
            }
        )

    user.password = request.new_password

    try:
        await db.commit()
        return JSONResponse(content={"message": "密码修改成功."})
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
