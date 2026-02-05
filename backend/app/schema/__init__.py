from datetime import datetime
from typing import Optional, TypeVar, Generic, List

from fastapi import HTTPException
from pydantic import BaseModel

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
