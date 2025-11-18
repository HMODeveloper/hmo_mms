from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, Integer, String, DateTime, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.core.database import Base


class UserLevel(Enum):
    """用户级别枚举

    定义系统中不同用户的级别.

    各个级别用户拥有的权限可以叠加.
    """

    SUPERADMIN = "超级管理员"
    """超级管理员权限:

    - 查看修改所有成员的所有信息.
    - 拥有所有部长的部门权限.
    """

    ADMIN = "管理员"
    """管理员权限:

    - 查看修改所有用户的基本信息和敏感信息.
    - 查看所有用户的任职信息和级别信息.
    """

    MINISTER = "部长"
    """部长权限:

    - 查看所有用户的基本信息, 任职信息和级别信息.
    - 查看所有成员的任职信息, 并可以添加普通成员至自己部门, 也可以移除本部门成员.
    """

    MEMBER = "普通成员"
    """普通成员权限:

    - 查看所有用户的基本信息, 任职信息和级别信息.
    - 修改自己的基本信息和敏感信息.
    """


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
    CCSEE = "信息科学与工程学院"
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
    OTHERS = "其他"


"""用户 - 部门关联表"""
user_department_association = Table(
    "user_department_association",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("department_id", Integer, ForeignKey("departments.id"), primary_key=True),
)


class Department(Base):
    """部门"""

    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    users: Mapped[List["User"]] = relationship(
        "User",
        secondary=user_department_association,
        back_populates="departments",
    )


class User(Base):
    """用户

    Attributes:
        id (int): 唯一标识符.
        qq_id (int): QQ号.
        nickname (str): 昵称.
        mc_name (str): Minecraft用户名.
        real_name (str): 真实姓名.
        student_id (str): 学号.
        college_enum (College): 学院枚举.
        college_name (str): 学院名称.
        major (str): 专业.
        grade (int): 年级.
        class_index (int): 班级序号.
        departments (List[Department]): 所属部门列表.
        level (UserLevel): 权限级别.
        password_hash (str): 密码哈希.
        update_at (datetime): 最近一次登录更新时间.
        token (str): 用于身份验证的唯一令牌.

    Methods:
        password: 设置密码时自动生成哈希值, 不可读取.
        verify_password(password: str) -> bool: 验证密码是否正确.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # 基本信息
    qq_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    nickname: Mapped[str] = mapped_column(String(50), nullable=False)
    mc_name: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)

    # 敏感信息
    real_name: Mapped[str] = mapped_column(String(20), nullable=False)
    student_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    college_enum: Mapped[College] = mapped_column(SAEnum(College), nullable=False)
    college_name: Mapped[str] = mapped_column(String(50), nullable=False)
    major: Mapped[str] = mapped_column(String(20), nullable=False)
    grade: Mapped[int] = mapped_column(Integer, nullable=False)
    class_index: Mapped[int] = mapped_column(Integer, nullable=False)

    # 任职信息
    departments: Mapped[List["Department"]] = relationship(
        "Department",
        secondary=user_department_association,
        back_populates="users",
    )
    level: Mapped[UserLevel] = mapped_column(SAEnum(UserLevel), nullable=False, default=UserLevel.MEMBER)

    # 其他信息
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    update_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    token: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)

    @property
    def password(self):
        raise AttributeError("密码不可读")

    @password.setter
    def password(self, password: str):
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha512")

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)
