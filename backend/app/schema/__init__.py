from datetime import datetime
from typing import Optional, TypeVar, Generic, List

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseResponse(BaseModel, Generic[T]):
    code: str
    data: Optional[T] = None


class BaseDepartment(BaseModel):
    code: str
    name: str


class BaseUserInfo(BaseModel):
    qq_id: int
    nickname: str
    mc_name: Optional[str]
    create_at: datetime
    real_name: str
    student_id: Optional[str]
    college_name: str
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int]
    departments: List[BaseDepartment]
    level: str
