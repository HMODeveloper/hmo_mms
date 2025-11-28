from typing import Optional, List
from datetime import datetime

from pydantic import BaseModel, Field

from .profile import DepartmentInfo
from .signup import CollegeInfo


class UserLevelInfo(BaseModel):
    level: str
    code: str


class MemberInfo(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")
    mc_name: Optional[str] = Field(..., serialization_alias="MCName")
    nickname: str
    create_at: datetime = Field(..., serialization_alias="createAt")
    real_name: str = Field(..., serialization_alias="realName")
    student_id: str = Field(..., serialization_alias="studentID")
    college_name: str = Field(..., serialization_alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., serialization_alias="classIndex")
    departments: List[DepartmentInfo]
    level: str


class MemberListResponse(BaseModel):
    members: List[MemberInfo]
    total: int


class SearchInfoResponse(BaseModel):
    """搜索信息响应"""

    colleges: List[CollegeInfo] = Field(...)
    departments: List[DepartmentInfo] = Field(..., serialization_alias="departments")
    levels: List[UserLevelInfo]


class SearchRequest(BaseModel):
    """搜索请求

    Notes:
        colleges, levels 传入对应模型的 `code`.
    """
    global_query: Optional[str] = Field(None, serialization_alias="globalQuery")
    create_at_start: Optional[datetime] = Field(None, serialization_alias="createAtStart")
    create_at_end: Optional[datetime] = Field(None, serialization_alias="createAtEnd")
    colleges: Optional[List[str]] = Field(None)
    departments: Optional[List[str]] = Field(None)
    levels: Optional[List[str]] = Field(None)
    page_size: Optional[int] = Field(5, serialization_alias="pageSize")
    page_index: Optional[int] = Field(1, serialization_alias="pageIndex")

