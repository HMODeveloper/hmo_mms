import secrets
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, APIRouter
from pyexpat.errors import messages
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import RedirectResponse

from app.core.database import get_db
from app.model import User
from app.schema.login import LoginRequest, LoginResponse


router = APIRouter(tags=["login"])


@router.post("/login", name="login")
async def login(
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


@router.get("/hw")
async def hw():
    return {"message": "hello world"}