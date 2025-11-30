import secrets
from datetime import datetime, timezone

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from app.core.database import get_db
from app.core.logger import logger
from app.utils import get_current_user
from app.model import User
from app.schema.auth import LoginRequest, LoginResponse


async def login_handler(
        request: LoginRequest,
        db: AsyncSession = Depends(get_db),
):
    user = (
        (await db.execute(
            select(User).where(User.qq_id == request.qq_id)
        ))
        .scalars().first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "用户不存在",
                "code": "USER_NOT_FOUND"
            }
        )

    if not user.verify_password(request.password):
        raise HTTPException(
            status_code=403,
            detail={
                "message": "密码错误",
                "code": "INVALID_PASSWORD"
            }
        )


    try:
        user.update_at = datetime.now(timezone.utc)
        user.token = secrets.token_hex(32)
        await db.commit()

        response = JSONResponse(
            content=LoginResponse(
                qq_id=user.qq_id,
                mc_name=user.mc_name,
                nickname=user.nickname,
            ).model_dump(),
        )

        response.set_cookie(
            "token",
            value=str(user.token),
            max_age=86400,
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


async def logout_handler(
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    try:
        user.token = None
        user.update_at = None

        await db.commit()
        return JSONResponse(content="注销成功")
    except Exception as e:
        raise e
