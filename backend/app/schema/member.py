from typing import List, Optional

from pydantic import BaseModel, Field

from app.schema import BaseUserInfo


MemberListResponse = List[BaseUserInfo]


class AddMemberRequest(BaseModel):
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


MemberInfoResponse = BaseUserInfo


class UpdateMemberInfoRequest(BaseModel):
    nickname: Optional[str]
    password: Optional[str]
    mc_name: Optional[str] = Field(..., alias="mcName")
    real_name: Optional[str] = Field(..., alias="realName")
    student_id: Optional[str] = Field(..., alias="studentId")
    college_code: Optional[str] = Field(..., alias="collegeCode")
    college_name: Optional[str] = Field(..., alias="collegeName")
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int] = Field(..., alias="classIndex")
