from fastapi import APIRouter

from app.handler import demo_handler

router = APIRouter(prefix="/api")

# auth
router.post("/login", name="login")(demo_handler)
router.get("/logout", name="logout")(demo_handler)
router.get("/user/info", name="get_user_info")(demo_handler)

# signup
router.get("/signup", name="signup_info")(demo_handler)
router.get("/signup/check", name="check_qq")(demo_handler)
router.post("/signup", name="signup")(demo_handler)

# user
router.put("/user/password", name="change_password")(demo_handler)
router.put("/user/info", name="update_user_info")(demo_handler)

# member
router.get("/member", name="member_list")(demo_handler)
router.get("/member/{qq_id}/info", name="get_member_info")(demo_handler)
router.put("/member/{qq_id}/info", name="update_member_info")(demo_handler)
router.put("/member/{qq_id}/password", name="reset_member_password")(demo_handler)

# department
router.get("/department", name="department_list")(demo_handler)
router.get("/department/{code}", name="department_member_list")(demo_handler)
router.post("/department", name="add_department")(demo_handler)
router.delete("/department/{code}", name="remove_department")(demo_handler)
router.post("/department/{code}/member", name="add_department_member")(demo_handler)
router.delete("/department/{code}/member", name="remove_department_member")(
    demo_handler
)
router.post("/department/{code}/minister", name="add_department_minister")(demo_handler)
router.delete("/department/{code}/minister", name="remove_department_minister")(
    demo_handler
)

# superadmin
router.post("/admin", name="add_admin")(demo_handler)
router.delete("/admin", name="remove_admin")(demo_handler)
router.post("/superadmin", name="add_superadmin")(demo_handler)
router.delete("/superadmin", name="remove_superadmin")(demo_handler)
