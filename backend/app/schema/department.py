from typing import Optional, List

from pydantic import BaseModel

from app.schema import BaseUserInfo


class MinisterInfo(BaseModel):
    qq_id: int
    nickname: str
    mc_name: Optional[str]


class DepartmentInfo(BaseModel):
    name: str
    code: str
    minister: List[MinisterInfo]


DepartmentListResponse = List[DepartmentInfo]

DepartmentMemberListResponse = List[BaseUserInfo]


class AddDepartmentRequest(BaseModel):
    name: str
    code: str
    minister: List[int]
    member: List[int]
