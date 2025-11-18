from fastapi import APIRouter

from app.handler.auth import login_handler, hw_handler

router = APIRouter()

router.post("/login", name="login")(login_handler)
router.get("/hw")(hw_handler)
