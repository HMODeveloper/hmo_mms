from fastapi import APIRouter

import app.handler.auth as auth
import app.handler.signup as signup
import app.handler.profile as profile
import app.handler.member as member

router = APIRouter(prefix="/api")

# auth
router.post("/login", name="login")(auth.login_handler)
router.get("/logout", name="logout")(auth.logout_handler)

# signup
router.get("/signup/info", name="signup_info")(signup.get_info_handler)
router.get("/signup/check_qq", name="signup_check_qq")(signup.check_qq_handler)
router.post("/signup", name="signup")(signup.signup_handler)

# profile
router.get("/profile", name="profile")(profile.get_info_handler)
router.put("/profile/update", name="profile_update")(profile.update_profile_handler)
router.put("/profile/change_password", name="change_password")(profile.change_password_handler)

# member
router.get("/member/info", name="search_info")(member.get_search_info_handler)
router.post("/member/search", name="member_search")(member.search_handler)
