from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.model import UserLevel, College, Department, User
api_router = APIRouter()

@api_router.get("/test")
async def test(
    db: AsyncSession = Depends(get_db),
):
    ...
