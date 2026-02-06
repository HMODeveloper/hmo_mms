# 后端设计文档

## 数据模型

### 部门用户表

- 表名: `user_department_association`
- 字段
	- `user_id` (`int`): 用户ID.
    - `department_id` (`int`): 部门ID.
    - `is_minister` (`bool`): 是否为部长.
    - `user` (`User`): 关联的用户对象.
    - `department` (`Department`): 关联的部门对象.

### 部门模型

- 表名: `departments`
- 字段
	- `id` (`int`): 唯一标识符.
	- `name` (`str`): 部门名称.
	- `code` (`str`): 部门代码.
	- `user_departments` (`List[UserDepartment]`): 用户-部门关联列表.
- 属性函数
	- `users` (`List[User]`): 部门成员列表.
	- `ministers` (`List[User]`): 部门部长列表.

### 用户模型

- 表名: `users`
- 字段
	- `id` (`int`): 唯一标识符.
	- `qq_id` (`int`): QQ号.
	- `nickname` (`str`): 昵称.
	- `mc_name` (`Optional[str]`): Minecraft用户名.
	- `create_at` (`datetime`): 账号创建时间.
	- `real_name` (`str`): 真实姓名.
	- `student_id` (`Optional[str]`): 学号(外校学生不必填写).
	- `college_enum` (`College`): 学院枚举.
	- `college_name` (`str`): 学院名称("其他"填写具体学院名, 外校学生填写学校名称).
	- `major` (`Optional[str]`): 专业(外校学生不必填写).
	- `grade` (`Optional[int]`): 年级(外校学生不必填写).
	- `class_index` (`Optional[int]`): 班级序号(外校学生不必填写).
	- `user_departments` (`List[UserDepartment]`): 用户-部门关联列表.
	- `level` (`UserLevel`): 权限级别.
	- `password_hash` (`str`): 密码哈希.
	- `update_at` (`Optional[datetime]`): 最近一次登录更新时间.
	- `token` (`Optional[str]`): 用于身份验证的唯一令牌.
- 属性函数
	- `departments` (`List[Department]`): 所属部门列表.
	- `password`: 设置密码时自动生成哈希值, 不可读取.
- 方法函数
	- `verify_password(password: str) -> bool`: 验证密码是否正确.
	- `has_permission(permission: UserLevel | List[UserLevel]) -> bool`: 检查用户是否具有指定权限.
	- `is_minister(code: str) -> bool`: 检查用户是否为指定部门的部长.

### 删除用户模型

- 表名: `deleted_users`
- 字段
	- `id` (`int`): 唯一标识符.
	- `qq_id` (`int`): QQ号.
	- `nickname` (`str`): 昵称.
	- `mc_name` (`Optional[str]`): Minecraft用户名.
	- `create_at` (`datetime`): 账号创建时间.
	- `real_name` (`str`): 真实姓名.
	- `student_id` (`Optional[str]`): 学号(外校学生不必填写).
	- `college_enum` (`College`): 学院枚举.
	- `college_name` (`str`): 学院名称("其他"填写具体学院名, 外校学生填写学校名称).
	- `major` (`Optional[str]`): 专业(外校学生不必填写).
	- `grade` (`Optional[int]`): 年级(外校学生不必填写).
	- `class_index` (`Optional[int]`): 班级序号(外校学生不必填写).
	- `deleted_at` (`datetime`): 删除时间.

## API 接口

### 注册

| 说明     | 方法     | 接口              | 请求                                      | 响应                                           | 函数                                             |
|--------|--------|-----------------|-----------------------------------------|----------------------------------------------|------------------------------------------------|
| 获取注册信息 | `GET`  | `/signup`       | 无                                       | [SignUpInfoResponse](./app/schema/signup.py) | [signup_info_handler](./app/handler/signup.py) |
| QQ号检查  | `GET`  | `/signup/check` | `qq_id: int`                            | `409 QQID_ALREADY_EXISTS`                    | [check_qq_handler](./app/handler/signup.py)    |
| 注册     | `POST` | `/signup`       | [SignUpRequest](./app/schema/signup.py) | `409 INTEGRITY_ERROR`                        | [signup_handler](./app/handler/signup.py)      |

### 登录


| 说明   | 方法     | 接口        | 请求                                   | 响应                                           | 函数                                             |
|------|--------|-----------|--------------------------------------|----------------------------------------------|------------------------------------------------|
| 登录   | `POST` | `/login`  | [LoginRequest](./app/schema/auth.py) | `404 USER_NOT_FOUND`, `401 INVALID_PASSWORD` | [signup_info_handler](./app/handler/auth.py)   |
| 登出   | `GET`  | `/logout` | 无                                    | `404 USER_NOT_FOUND`                         | [logout_handler](./app/handler/auth.py)        |
| 获取信息 | `POST` | `/signup` | 无                                    | `404 USER_NOT_FOUND`                         | [get_user_info_handler](./app/handler/auth.py) |


### 个人操作

| 说明   | 方法       | 接口               | 请求                                            | 响应                                                     | 函数                                                |
|------|----------|------------------|-----------------------------------------------|--------------------------------------------------------|---------------------------------------------------|
| 注销账户 | `DELETE` | `/user`          | 无                                             | `404 USER_NOT_FOUND`, `403 SUPERADMIN_REQUIRED`        | [remove_user_handler](./app/handler/user.py)      |
| 修改密码 | `PUT`    | `/user/password` | [ChangePasswordRequest](./app/schema/user.py) | `403 INVALID_OLD_PASSWORD`, `400 SAME_AS_OLD_PASSWORD` | [change_password_handler](./app/handler/user.py)  |
| 修改信息 | `PUT`    | `/user/info`     | [UpdateUserInfoRequest](./app/schema/user.py) | `409 INTEGRITY_ERROR`                                  | [update_user_info_handler](./app/handler/user.py) |

### 成员管理

| 说明     | 方法       | 接口                         | 请求                                                | 响应                                              | 函数                                                            |
|--------|----------|----------------------------|---------------------------------------------------|-------------------------------------------------|---------------------------------------------------------------|
| 成员列表   | `GET`    | `/member`                  | 无                                                 | [MemberListResponse](./app/schema/member.py)    | [member_list_handler](./app/handler/member/__init__.py)       |
| 添加成员   | `POST`   | `/member`                  | [AddMemberRequest](./app/schema/member.py)        | `403 ADMIN_REQUIRED`, `409 INTEGRITY_ERROR`     | [add_member_handler](./app/handler/member/__init__.py)        |
| 删除成员   | `DELETE` | `/member`                  | `qq_id: int`                                      | `404 USER_NOT_FOUND`, `403 SUPERADMIN_REQUIRED` | [remove_member_handler](./app/handler/member/__init__.py)     |
| 获取成员信息 | `GET`    | `/member/{qq_id}/info`     | `qq_id: int`                                      | `404 USER_NOT_FOUND`                            | [get_member_info_handler](./app/handler/member/info.py)       |
| 更新成员信息 | `PUT`    | `/member/{qq_id}/info`     | [UpdateMemberInfoRequest](./app/schema/member.py) | `403 ADMIN_REQUIRED`, `404 USER_NOT_FOUND`      | [update_member_info_handler](./app/handler/member/info.py)    |
| 重置成员密码 | `PUT`    | `/member/{qq_id}/password` | `qq_id: int`                                      | `403 ADMIN_REQUIRED`, `404 USER_NOT_FOUND`      | [reset_member_password_handler](./app/handler/member/info.py) |

### 部门管理

| 说明     | 方法       | 接口                            | 请求                                                 | 响应                                                                                                                                                                                | 函数                                                                         |
|--------|----------|-------------------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| 部门列表   | `GET`    | `/department`                 | 无                                                  | [DepartmentListResponse](./app/schema/department.py)                                                                                                                              | [department_list_handler](./app/handler/department/__init__.py)            |
| 添加部门   | `POST`   | `/department`                 | [AddDepartmentRequest](./app/schema/department.py) | `403 SUPERADMIN_REQUIRED`, `409 DEPT_CODE_EXISTS`, `409 DEPT_NAME_EXISTS`, `404 MINISTER_NOT_FOUND`, `404 MEMBER_NOT_FOUND`, `400 MINISTER_NOT_IN_MEMBERS`, `409 INTEGRITY_ERROR` | [add_department_handler](./app/handler/department/__init__.py)             |
| 删除部门   | `DELETE` | `/department/{code}`          | `code: str`                                        | `403 SUPERADMIN_REQUIRED`, `404 DEPT_NOT_FOUND`, `400 DEPT_NOT_EMPTY`                                                                                                             | [remove_department_handler](./app/handler/department/__init__.py)          |
| 部门成员列表 | `GET`    | `/department/{code}`          | `code: str`                                        | `404 DEPT_NOT_FOUND`                                                                                                                                                              | [department_member_list_handler](./app/handler/department/member.py)       |
| 添加部门成员 | `POST`   | `/department/{code}/member`   | `code: str`, `qq_id: int`                          | `404 DEPT_NOT_FOUND`, `403 MINISTER_REQUIRED`, `404 USER_NOT_FOUND`, `409 USER_ALREADY_IN_DEPT`                                                                                   | [add_department_member_handler](./app/handler/department/member.py)        |
| 移除部门成员 | `DELETE` | `/department/{code}/member`   | `code: str`, `qq_id: int`                          | `404 DEPT_NOT_FOUND`, `404 USER_NOT_FOUND`, `409 USER_NOT_IN_DEPT`, `403 SUPERADMIN_REQUIRED`, `403 MINISTER_REQUIRED`                                                            | [remove_department_member_handler](./app/handler/department/member.py)     |
| 添加部长   | `POST`   | `/department/{code}/minister` | `code: str`, `qq_id: int`                          | `403 SUPERADMIN_REQUIRED`, `404 DEPT_NOT_FOUND`, `404 USER_NOT_FOUND`, `404 USER_NOT_IN_DEPT`, `409 USER_ALREADY_MINISTER`                                                        | [add_department_minister_handler](./app/handler/department/minister.py)    |
| 移除部长   | `DELETE` | `/department/{code}/minister` | `code: str`, `qq_id: int`                          | `403 SUPERADMIN_REQUIRED`, `404 DEPT_NOT_FOUND`, `404 USER_NOT_FOUND`, `404 USER_NOT_IN_DEPT`, `409 USER_NOT_MINISTER`                                                            | [remove_department_minister_handler](./app/handler/department/minister.py) |

### 超管权限

| 说明      | 方法       | 接口            | 请求           | 响应                                                                                                | 函数                                                       |
|---------|----------|---------------|--------------|---------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| 添加管理员   | `POST`   | `/admin`      | `qq_id: int` | `403 SUPERADMIN_REQUIRED`, `404 USER_NOT_FOUND`, `409 USER_ALREADY_ADMIN`                         | [add_admin_handler](./app/handler/superadmin.py)         |
| 移除管理员   | `DELETE` | `/admin`      | `qq_id: int` | `403 SUPERADMIN_REQUIRED`, `404 USER_NOT_FOUND`, `409 USER_NOT_ADMIN`                             | [remove_admin_handler](./app/handler/superadmin.py)      |
| 添加超级管理员 | `POST`   | `/superadmin` | `qq_id: int` | `403 SUPERADMIN_REQUIRED`, `404 USER_NOT_FOUND`, `409 USER_ALREADY_SUPERADMIN`                    | [add_superadmin_handler](./app/handler/superadmin.py)    |
| 移除超级管理员 | `DELETE` | `/superadmin` | `qq_id: int` | `403 SUPERADMIN_REQUIRED`, `404 USER_NOT_FOUND`, `409 USER_NOT_SUPERADMIN`, `400 LAST_SUPERADMIN` | [remove_superadmin_handler](./app/handler/superadmin.py) |
