from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from sqlalchemy import Enum as SAEnum, Boolean
from sqlalchemy import ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.core.database import Base


class UserLevel(Enum):
    """用户级别枚举"""

    SUPERADMIN = "超级管理员"
    ADMIN = "管理员"
    MEMBER = "普通成员"


class College(Enum):
    """学院枚举"""

    NIoOE = "国家卓越工程师学院"
    YLA = "岳麓书院(历史与哲学学院)"
    CET = "经济与贸易学院"
    CFS = "金融与统计学院"
    SOL = "法学院"
    SOM = "马克思主义学院"
    CFL = "外国语学院"
    SJC = "新闻与传播学院"
    SM = "数学学院"
    SPM = "物理与微电子科学学院"
    CCCE = "化学化工学院"
    SB = "生物学院"
    CMVE = "机械与运载工程学院"
    SMSE = "材料科学与工程学院"
    CEIE = "电气与信息工程学院"
    CCSEE = "计算机学院"
    SAP = "建筑与规划学院"
    CCE = "土木工程学院"
    CESE = "环境科学与工程学院"
    IBS = "工商管理学院"
    SPA = "公共管理学院"
    SD = "设计艺术学院"
    SAIR = "人工智能与机器人学院"
    SSIC = "半导体学院(集成电路学院)"
    SCSS = "网络空间安全学院"
    LCA = "隆平农学院"
    SFT = "未来技术学院"
    NOT_HNU = "外校学生"
    OTHERS = "其他"


class UserDepartment(Base):
    """用户 - 部门关联对象

    用于存储用户和部门的关联关系及部长标识

    Attributes:
        user_id (int): 用户ID.
        department_id (int): 部门ID.
        is_minister (bool): 是否为部长.
        user (User): 关联的用户对象.
        department (Department): 关联的部门对象.
    """

    __tablename__ = "user_department_association"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id"), primary_key=True
    )
    is_minister: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # 关联到用户和部门
    user: Mapped["User"] = relationship("User", back_populates="user_departments")
    department: Mapped["Department"] = relationship(
        "Department", back_populates="user_departments"
    )


class Department(Base):
    """部门

    Attributes:
        id (int): 唯一标识符.
        name (str): 部门名称.
        code (str): 部门代码.
        user_departments (List[UserDepartment]): 用户-部门关联列表.

    Properties:
        users (List[User]): 部门成员列表.
        ministers (List[User]): 部门部长列表(从用户列表中筛选).
    """

    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # 关联对象
    user_departments: Mapped[List["UserDepartment"]] = relationship(
        "UserDepartment", back_populates="department", cascade="all, delete-orphan"
    )

    @property
    def users(self) -> List["User"]:
        """返回该部门的所有用户列表"""
        return [ud.user for ud in self.user_departments]

    @property
    def ministers(self) -> List["User"]:
        """返回该部门的部长列表"""
        return [ud.user for ud in self.user_departments if ud.is_minister]


class User(Base):
    """用户

    Attributes:
        id (int): 唯一标识符.
        qq_id (int): QQ号.
        nickname (str): 昵称.
        mc_name (Optional[str]): Minecraft用户名.
        create_at (datetime): 账号创建时间.
        real_name (str): 真实姓名.
        student_id (Optional[str]): 学号(外校学生不必填写).
        college_enum (College): 学院枚举.
        college_name (str): 学院名称("其他"填写具体学院名, 外校学生填写学校名称).
        major (Optional[str]): 专业(外校学生不必填写).
        grade (Optional[int]): 年级(外校学生不必填写).
        class_index (Optional[int]): 班级序号(外校学生不必填写).
        user_departments (List[UserDepartment]): 用户-部门关联列表.
        level (UserLevel): 权限级别.
        password_hash (str): 密码哈希.
        update_at (Optional[datetime]): 最近一次登录更新时间.
        token (Optional[str]): 用于身份验证的唯一令牌.

    Properties:
        departments (List[Department]): 所属部门列表.
        password: 设置密码时自动生成哈希值, 不可读取.

    Methods:
        verify_password(password: str) -> bool: 验证密码是否正确.
        has_permission(permission: UserLevel | List[UserLevel]) -> bool: 检查用户是否具有指定权限.
        is_minister(code: str) -> bool: 检查用户是否为指定部门的部长.
        sensitive_permission(user) -> bool: 检查用户是否具有访问敏感信息的权限.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # 基本信息
    qq_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    nickname: Mapped[str] = mapped_column(String(50), nullable=False)
    mc_name: Mapped[Optional[str]] = mapped_column(
        String(50), unique=True, nullable=True
    )
    create_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # 敏感信息
    real_name: Mapped[str] = mapped_column(String(20), nullable=False)
    student_id: Mapped[Optional[str]] = mapped_column(
        String(20), unique=True, nullable=True
    )
    college_enum: Mapped[College] = mapped_column(SAEnum(College), nullable=False)
    college_name: Mapped[str] = mapped_column(String(50), nullable=False)
    major: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    grade: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    class_index: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # 任职信息
    user_departments: Mapped[List["UserDepartment"]] = relationship(
        "UserDepartment", back_populates="user", cascade="all, delete-orphan"
    )
    level: Mapped[UserLevel] = mapped_column(
        SAEnum(UserLevel), nullable=False, default=UserLevel.MEMBER
    )

    # 其他信息
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    update_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    token: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )

    @property
    def password(self):
        raise AttributeError("密码不可读")

    @password.setter
    def password(self, password: str):
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha512")

    @property
    def departments(self) -> List["Department"]:
        return [ud.department for ud in self.user_departments]

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def has_permission(self, permission: UserLevel | List[UserLevel]):
        if self.level == UserLevel.SUPERADMIN:
            return True

        if isinstance(permission, list):
            return self.level in permission

        return self.level == permission

    def is_minister(self, code: str) -> bool:
        for ud in self.user_departments:
            if ud.department.code == code and ud.is_minister:
                return True
        return False

    def sensitive_permission(self, user=None) -> bool:
        if not user:
            return self.has_permission(UserLevel.SUPERADMIN)
        return self.has_permission(UserLevel.ADMIN) or self.id == user.id


class DeletedUser(Base):
    """已删除的用户表

    Attributes:
        id (int): 唯一标识符.
        qq_id (int): QQ号.
        nickname (str): 昵称.
        mc_name (Optional[str]): Minecraft用户名.
        create_at (datetime): 账号创建时间.
        real_name (str): 真实姓名.
        student_id (Optional[str]): 学号(外校学生不必填写).
        college_enum (College): 学院枚举.
        college_name (str): 学院名称("其他"填写具体学院名, 外校学生填写学校名称).
        major (Optional[str]): 专业(外校学生不必填写).
        grade (Optional[int]): 年级(外校学生不必填写).
        class_index (Optional[int]): 班级序号(外校学生不必填写).
        deleted_at (datetime): 删除时间.
    """

    __tablename__ = "deleted_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # 基本信息
    qq_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    nickname: Mapped[str] = mapped_column(String(50), nullable=False)
    mc_name: Mapped[Optional[str]] = mapped_column(
        String(50), unique=True, nullable=True
    )
    create_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # 敏感信息
    real_name: Mapped[str] = mapped_column(String(20), nullable=False)
    student_id: Mapped[Optional[str]] = mapped_column(
        String(20), unique=True, nullable=True
    )
    college_enum: Mapped[College] = mapped_column(SAEnum(College), nullable=False)
    college_name: Mapped[str] = mapped_column(String(50), nullable=False)
    major: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    grade: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    class_index: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # 其他信息
    deleted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
