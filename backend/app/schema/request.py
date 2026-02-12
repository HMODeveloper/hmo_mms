from typing import Optional

from pydantic import BaseModel, Field


class UpdateMemberInfoRequest(BaseModel):
    nickname: Optional[str]
    password: Optional[str]
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: Optional[str] = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college: Optional[str]
    school: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")


class AddMemberRequest(BaseModel):
    qq_id: int = Field(..., alias="QQID")
    nickname: str
    password: str
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: str = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college: str
    school: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")
