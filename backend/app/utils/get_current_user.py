from fastapi import HTTPException, Request, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.model import User


async def get_current_user(
        request: Request,
        db: AsyncSession = Depends(get_db),
) -> User:
    token = request.headers.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="认证失败: 缺少 token")

    user = (
        (await db.execute(
            select(User).where(User.token == token)
        ))
        .scalars()
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="认证失败: 用户不存在")

    return user
