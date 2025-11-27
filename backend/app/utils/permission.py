from enum import Enum
from typing import List
from app.model import User, UserLevel


def has_permission(
        user: User,
        permission: UserLevel | List[UserLevel]
):
    """检查用户是否有指定权限

    Args:
        user (User): 用户对象
        permission (UserLevel | List[UserLevel]): 单个权限（UserLevel）或权限列表（List[UserLevel]）
    """
    if user is None or permission is None:
        return False

    if user.level == UserLevel.SUPERADMIN:
        return True

    if isinstance(permission, list):
        return user.level in permission

    return user.level == permission
