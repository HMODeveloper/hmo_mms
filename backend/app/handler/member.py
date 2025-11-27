from datetime import timezone

from fastapi import Depends, HTTPException
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette.responses import JSONResponse

from app.core.database import get_db
from app.core.logger import logger
from app.utils import get_current_user, has_permission
from app.model import User, UserLevel, College, Department
from app.schema.member import (
    UserLevelInfo,
    MemberInfo,
    MemberListResponse,
    SearchInfoResponse,
    SearchRequest,
)
from app.schema.profile import DepartmentInfo


async def get_search_info_handler(
        db: AsyncSession = Depends(get_db),
):
    college_name = []
    for college in College:
        if college != College.OTHERS:
            college_name.append(college.value)

    department_name = []
    departments = (
        (await db.execute(
            select(Department)
        ))
        .scalars().all()
    )
    for department in departments:
        department_name.append(
            DepartmentInfo(
                name=department.name,
                code=department.code
            )
        )

    levels = []
    for level in UserLevel:
        levels.append(
            UserLevelInfo(
                level=level.value,
                code=level.name
            )
        )

    response = SearchInfoResponse(
        college_names=college_name,
        departments=department_name,
        levels=levels,
    )
    return JSONResponse(
        content=response,
    )


async def search_handler(
        request: SearchRequest,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
):
    sensitivePermission = has_permission(user, UserLevel.ADMIN)
    offset = (request.page_index - 1) * request.page_size
    filters = []

    try:
        # 全局搜索
        if request.global_query is not None:
            global_filters = [
                User.qq_id.like(f"%{request.global_query}%"),
                User.nickname.like(f"%{request.global_query}%"),
                User.mc_name.like(f"%{request.global_query}%"),
            ]

            if sensitivePermission:
                sensitive_global_filters = [
                    User.real_name.like(f"%{request.global_query}%"),
                    User.student_id.like(f"%{request.global_query}%"),
                    User.college_name.like(f"%{request.global_query}%"),
                    User.major.name.like(f"%{request.global_query}%"),
                ]
                global_filters.extend(sensitive_global_filters)

            filters.append(or_(*global_filters))

        # 入库时间
        if request.create_at_start is not None and request.create_at_end is not None:
            filters.append(User.create_at.between(request.create_at_start, request.create_at_start))

        # 学院
        if request.college_name is not None:
            colleges = []
            for college in College:
                if college.value == request.college_name:
                    colleges.append(college)
            filters.append(User.college_enum.in_(colleges))

        # 部门
        if request.departments is not None:
            departments = (
                (await db.execute(
                    select(Department)
                    .where(Department.code.in_(request.departments))
                ))
                .scalars().all()
            )
            filters.append(User.departments.in_(departments))

        # 等级
        if request.levels is not None:
            levels = []
            for level in UserLevel:
                if level.name in request.levels:
                    levels.append(level)
            filters.append(User.level.in_(levels))

        # 搜索
        base_query = select(User).where(and_(*filters))
        query = (
            (
                base_query.order_by(
                    User.id.desc(),
                )
                .offset(offset)
                .limit(request.page_size)
            ).options(
                joinedload(User.departments),
            )
        )
        users = (
            (await db.execute(query))
            .scalars().all()
        )

        # 构建结果
        members = []
        for user_info in users:
            departments = []
            for department in user_info.departments:
                departments.append(DepartmentInfo(
                    name=department.name,
                    code=department.code
                ))

            members.append(MemberInfo(
                qq_id=user_info.qq_id,
                mc_name=user_info.mc_name,
                nickname=user_info.nickname,
                create_at=user_info.create_at.replace(tzinfo=timezone.utc),
                real_name=user_info.real_name if sensitivePermission else "***",
                student_id=user_info.student_id if sensitivePermission else "***",
                college_name=user_info.college_name,
                major=user_info.major if sensitivePermission else None,
                grade=user_info.grade if sensitivePermission else None,
                class_index=user_info.class_index if sensitivePermission else None,
                departments=departments,
                level=user_info.level.value,
            ))
        total = len(members)

        response = MemberListResponse(
            members=members,
            total=total,
        )
        return JSONResponse(
            content=response,
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "服务器内部错误，请联系管理员",
                "code": "SERVER_ERROR"
            }
        )