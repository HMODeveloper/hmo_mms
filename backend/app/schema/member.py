from typing import List, Optional

from pydantic import BaseModel

from app.schema import BaseUserInfo


MemberListResponse = List[BaseUserInfo]


class AddMemberRequest(BaseModel):
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


MemberInfoResponse = BaseUserInfo


class UpdateMemberInfoRequest(BaseModel):
    nickname: Optional[str]
    password: Optional[str]
    mc_name: Optional[str]
    real_name: Optional[str]
    student_id: Optional[str]
    college_name: Optional[str]
    major: Optional[str]
    grade: Optional[int]
    class_index: Optional[int]
