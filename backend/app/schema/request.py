from typing import Optional

from pydantic import BaseModel, Field


class UpdateMemberInfoRequest(BaseModel):
    nickname: Optional[str] = None
    mc_name: Optional[str] = Field(None, alias="mcName")
    real_name: Optional[str] = Field(None, alias="realName")
    student_id: Optional[str] = Field(None, alias="studentID")
    college: Optional[str] = None
    school: Optional[str] = None
    major: Optional[str] = None
    grade: Optional[int] = None
    class_index: Optional[int] = Field(None, alias="classIndex")


class AddMemberRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")
    nickname: str
    password: str
    mc_name: Optional[str] = Field(None, alias="mcName")
    real_name: str = Field(..., alias="realName")
    student_id: Optional[str] = Field(None, alias="studentID")
    college: str
    school: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(None, alias="classIndex")
