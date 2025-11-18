import secrets
from datetime import datetime

from fastapi import Depends, HTTPException
from pyexpat.errors import messages
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.model import User
from app.schema.login import LoginRequest, LoginResponse


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
            token=user.token,
        )
    except Exception as e:
        raise e


async def hw_handler():
    return {"message": "Hello World"}
