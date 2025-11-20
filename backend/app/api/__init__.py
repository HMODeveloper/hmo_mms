from fastapi import APIRouter

import app.handler.auth as auth
import app.handler.signup as signup

router = APIRouter(prefix="/api")

# auth
router.post("/login", name="login")(auth.login_handler)
router.get("/logout", name="logout")(auth.logout_handler)

# signup
router.get("/signup/info", name="signup_info")(signup.get_info_handler)
router.get("/signup/check_qq", name="signup_check_qq")(signup.check_qq_handler)
router.post("/signup", name="signup")(signup.signup_handler)
