from typing import Optional

from pydantic import BaseModel


class ChangePasswordRequest(BaseModel):
    old: str
    new: str


class UpdateUserInfoRequest(BaseModel):
    nickname: Optional[str]
    password: Optional[str]
    mc_name: Optional[str]
    real_name: Optional[str]
    student_id: Optional[str]
    college_name: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int]
