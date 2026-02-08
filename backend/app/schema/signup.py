from typing import Optional

from pydantic import BaseModel, Field


class CollegeInfo(BaseModel):
    name: str
    code: str


class SignUpInfoResponse(BaseModel):
    colleges: list[CollegeInfo]


class SignUpRequest(BaseModel):
    qq_id: int = Field(..., alias="QQID")
    nickname: str
    password: str
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: str = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college_code: str = Field(..., alias="collegeCode")
    college_name: str = Field(..., alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")
