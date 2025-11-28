from datetime import timezone, datetime

from fastapi import Depends, HTTPException
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import subqueryload

from app.core.database import get_db
from app.core.logger import logger
from app.schema.signup import CollegeInfo
from app.utils import get_current_user, has_permission
from app.model import User, UserLevel, College, Department, user_department_association
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
    colleges_info = []
    for college in College:
        if college != College.OTHERS:
            colleges_info.append(CollegeInfo(
                name=str(college.value),
                code=college.name,
            ))

    departments_info = []
    departments = (
        (await db.execute(
            select(Department)
        ))
        .scalars().all()
    )
    for department in departments:
        departments_info.append(
            DepartmentInfo(
                name=department.name,
                code=department.code
            )
        )

    levels_info = []
    for level in UserLevel:
        levels_info.append(
            UserLevelInfo(
                level=level.value,
                code=level.name
            )
        )

    response = SearchInfoResponse(
        colleges=colleges_info,
        departments=departments_info,
        levels=levels_info,
    )
    return response


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
        # TODO: None问题
        if request.global_query is not None:
            global_filters = [
                User.qq_id.ilike(f"%{request.global_query}%"),
                User.nickname.ilike(f"%{request.global_query}%"),
                User.mc_name.ilike(f"%{request.global_query}%"),
            ]

            if sensitivePermission:
                sensitive_global_filters = [
                    User.real_name.ilike(f"%{request.global_query}%"),
                    User.student_id.ilike(f"%{request.global_query}%"),
                    User.college_name.ilike(f"%{request.global_query}%"),
                    User.major.name.ilike(f"%{request.global_query}%"),
                ]
                global_filters.extend(sensitive_global_filters)

            filters.append(or_(*global_filters))

        # 入库时间
        if request.create_at_start is not None and request.create_at_end is not None:
            filters.append(User.create_at.between(request.create_at_start, request.create_at_start))

        # 学院
        if request.colleges:
            colleges = []
            for college in College:
                if college.name in request.colleges:
                    colleges.append(college)
            filters.append(User.college_enum.in_(colleges))

        # 部门
        if request.departments:
            departments = (
                (await db.execute(
                    select(Department)
                    .where(Department.code.in_(request.departments))
                ))
                .scalars().all()
            )

            department_ids = [_.id for _ in departments]
            filters.append(
                User.id.in_(
                    select(user_department_association.c.user_id)
                    .where(user_department_association.c.department_id.in_(department_ids))
                )
            )

        # 等级
        if request.levels:
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
                subqueryload(User.departments),
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
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "服务器内部错误，请联系管理员",
                "code": "SERVER_ERROR"
            }
        )