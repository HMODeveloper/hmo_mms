from fastapi import APIRouter

from .login import router as login_router

api_router = APIRouter()
api_router.include_router(login_router)
