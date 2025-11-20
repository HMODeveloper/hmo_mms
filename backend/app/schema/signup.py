from typing import Optional

from pydantic import BaseModel, Field

class CollegeInfo(BaseModel):
    name: str
    code: str


class CollegeListResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int
    nickname: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    mc_name: Optional[str]
    real_name: str = Field(..., min_length=1)
    student_id: str
    college_name: str = Field(..., min_length=1)
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int]
