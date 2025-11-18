from fastapi import HTTPException, Request, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.model import User


async def get_current_user(
        request: Request,
        db: AsyncSession = Depends(get_db),
) -> User:
    user_id = request.cookies.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="认证失败: 缺少 user_id")

    user = (
        (await db.execute(select(User).where(User.id == user_id)))
        .scalars()
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="认证失败: 用户不存在")

    return user
