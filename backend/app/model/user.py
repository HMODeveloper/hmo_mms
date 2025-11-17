from enum import Enum

from sqlalchemy import Integer, Table, Column, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class UserPermission(Enum):
    ...

class UserRole(Base):
    """用户角色

    Attributes:
        id (int): 角色ID
        name (str): 角色名称
        description (str): 角色描述
    """

    __tablename__ = "user_roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=True)


class User(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    mc_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    roles: Mapped[list["UserRole"]] = mapped_column(
        ForeignKey("user_roles.id"), nullable=True
    )
