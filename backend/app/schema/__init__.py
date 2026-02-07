from datetime import datetime
from typing import Optional, TypeVar, Generic, List

from fastapi import HTTPException
from pydantic import BaseModel, Field

T = TypeVar("T", bound=BaseModel)


class BaseResponse(BaseModel, Generic[T]):
    code: str
    data: Optional[T]


class Response(BaseResponse, Generic[T]):
    def __init__(self, data: Optional[T] = None):
        super().__init__(
            code="OK",
            data=data,
        )


class ErrorResponse(HTTPException):
    def __init__(self, status_code: int = 500, code: str = "INTERNAL_SERVER_ERROR"):
        super().__init__(
            status_code=status_code, detail=BaseResponse(code=code, data=None)
        )


class BaseDepartment(BaseModel):
    code: str
    name: str


class BaseUserInfo(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")
    nickname: str
    mc_name: Optional[str] = Field(..., serialization_alias="mcName")
    create_at: datetime = Field(..., serialization_alias="createAt")
    real_name: str = Field(..., serialization_alias="realName")
    student_id: Optional[str] = Field(..., serialization_alias="studentId")
    college_name: str = Field(..., serialization_alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., serialization_alias="classIndex")
    departments: List[BaseDepartment]
    level: str
