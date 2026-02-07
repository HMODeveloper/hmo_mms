from typing import Optional, List

from pydantic import BaseModel, Field

from app.schema import BaseUserInfo


class MinisterInfo(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")
    nickname: str
    mc_name: Optional[str] = Field(..., serialization_alias="mcName")


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
