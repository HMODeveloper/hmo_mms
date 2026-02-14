from datetime import datetime
from typing import Optional, TypeVar, List

from fastapi import HTTPException
from pydantic import BaseModel, Field

T = TypeVar("T", bound=BaseModel)


class ErrorResponse(HTTPException):
    def __init__(self, status_code: int = 500, code: str = "INTERNAL_SERVER_ERROR"):
        super().__init__(status_code=status_code, detail=code)


class BaseUserDepartment(BaseModel):
    code: str
    name: str


class BaseUserInfo(BaseModel):
    qq_id: str = Field(..., serialization_alias="QQID")
    nickname: str
    mc_name: Optional[str] = Field(..., serialization_alias="mcName")
    create_at: datetime = Field(..., serialization_alias="createAt")
    real_name: str = Field(..., serialization_alias="realName")
    student_id: Optional[str] = Field(..., serialization_alias="studentID")
    college: str
    school: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., serialization_alias="classIndex")
    departments: List[BaseUserDepartment]
    level: str


class BaseDepartmentInfo(BaseModel):
    name: str
    code: str
    minister: List[str]
    member: List[str]


class BaseCollegeInfo(BaseModel):
    name: str
    code: str
