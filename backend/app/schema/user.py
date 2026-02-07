from typing import Optional

from pydantic import BaseModel, Field


class ChangePasswordRequest(BaseModel):
    old: str
    new: str


class UpdateUserInfoRequest(BaseModel):
    nickname: Optional[str]
    password: Optional[str]
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: Optional[str] = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college_name: Optional[str] = Field(..., alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")
