import secrets
from datetime import datetime

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
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
        raise HTTPException(status_code=404, detail="用户不存在")

    if not user.verify_password(request.password):
        raise HTTPException(status_code=403, detail="密码错误")


    try:
        user.update_at = datetime.now()
        user.token = secrets.token_hex(32)
        await db.commit()

        return LoginResponse(
            user_id=user.id,
            nickname=user.nickname,
            token=str(user.token),
        )
    except Exception as e:
        raise e


async def logout_handler(
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    try:
        user.token = None
        user.update_at = None

        await db.commit()
        return {"message": "注销成功"}
    except Exception as e:
        raise e
