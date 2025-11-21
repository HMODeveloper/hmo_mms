from typing import Optional

from pydantic import BaseModel, Field

class CollegeInfo(BaseModel):
    name: str
    code: str


class CollegeListResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int = Field(..., alias="QQID")
    nickname: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    mc_name: Optional[str] = Field(... ,alias="MCName")
    real_name: str = Field(..., min_length=1)
    student_id: str = Field(..., alias="studentID")
    college_name: str = Field(..., min_length=1, alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")
