from fastapi import APIRouter

from app.handler.auth import login_handler, logout_handler

router = APIRouter()

router.post("/login", name="login")(login_handler)
router.get("/logout", name="logout")(logout_handler)
