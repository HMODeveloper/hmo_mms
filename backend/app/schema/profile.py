from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class DepartmentInfo(BaseModel):
    name: str
    code: str


class GetProfileResponse(BaseModel):
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


class UpdateProfileRequest(BaseModel):
    mc_name: Optional[str] = Field(None, alias="MCName")
    nickname: Optional[str] = None
    real_name: Optional[str] = Field(None, alias="realName")
    student_id: Optional[str] = Field(None, alias="studentID")
    college_name: Optional[str] = Field(None, alias="collegeName")
    major: Optional[str] = None
    grade: Optional[int] = None
    class_index: Optional[int] = Field(None, alias="classIndex")


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., alias="oldPassword")
    new_password: str = Field(..., alias="newPassword")
