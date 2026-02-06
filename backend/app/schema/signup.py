from typing import Optional

from pydantic import BaseModel


class CollegeInfo(BaseModel):
    name: str
    code: str


class SignUpInfoResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int
    nickname: str
    password: str
    mc_name: Optional[str]
    real_name: str
    student_id: Optional[str]
    college_name: str
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int]
