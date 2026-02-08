from fastapi import Request, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.model import User
from app.schema import ErrorResponse


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    token = request.cookies.get("token")
    if not token:
        raise ErrorResponse(
            status_code=401,
            code="AUTH_NO_TOKEN",
        )

    user = (await db.execute(select(User).where(User.token == token))).scalars().first()

    if not user:
        raise ErrorResponse(
            status_code=404,
            code="AUTH_USER_NOT_FOUND",
        )

    return user
