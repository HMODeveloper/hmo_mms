from fastapi import APIRouter

import app.handler.auth as auth
import app.handler.signup as signup
import app.handler.user as user
import app.handler.member as member
import app.handler.department as department
import app.handler.department.member as department_member
import app.handler.department.minister as department_minister
import app.handler.superadmin as superadmin

router = APIRouter(prefix="/api")

# auth
router.post("/login", name="login")(auth.login_handler)
router.get("/logout", name="logout")(auth.logout_handler)
router.get("/user/info", name="get_user_info")(auth.get_user_info_handler)

# signup
router.get("/signup", name="signup_info")(signup.signup_info_handler)
router.get("/signup/check", name="check_qq")(signup.check_qq_handler)
router.post("/signup", name="signup")(signup.signup_handler)

# user
router.put("/user/password", name="change_password")(user.change_password_handler)
router.put("/user/info", name="update_user_info")(user.update_user_info_handler)

# member
router.get("/member", name="member_list")(member.member_list_handler)
router.post("/member", name="add_member")(member.add_member_handler)
router.delete("/member", name="remove_member")(member.remove_member_handler)
router.get("/member/{qq_id}/info", name="get_member_info")(
    member.get_member_info_handler
)
router.put("/member/{qq_id}/info", name="update_member_info")(
    member.update_member_info_handler
)
router.put("/member/{qq_id}/password", name="reset_member_password")(
    member.reset_member_password_handler
)

# department
router.get("/department", name="department_list")(department.department_list_handler)
router.post("/department", name="add_department")(department.add_department_handler)
router.delete("/department/{code}", name="remove_department")(
    department.remove_department_handler
)

router.get("/department/{code}", name="department_member_list")(
    department_member.department_member_list_handler
)
router.post("/department/{code}/member", name="add_department_member")(
    department_member.add_department_member_handler
)
router.delete("/department/{code}/member", name="remove_department_member")(
    department_member.remove_department_member_handler
)

router.post("/department/{code}/minister", name="add_department_minister")(
    department_minister.add_department_minister_handler
)
router.delete("/department/{code}/minister", name="remove_department_minister")(
    department_minister.remove_department_minister_handler
)

# superadmin
router.post("/admin", name="add_admin")(superadmin.add_admin_handler)
router.delete("/admin", name="remove_admin")(superadmin.remove_admin_handler)
router.post("/superadmin", name="add_superadmin")(superadmin.add_superadmin_handler)
router.delete("/superadmin", name="remove_superadmin")(
    superadmin.remove_superadmin_handler
)
