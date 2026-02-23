from typing import List

from pydantic import BaseModel, Field

from app.schema import BaseDepartmentInfo


DepartmentListResponse = List[BaseDepartmentInfo]


DepartmentInfoResponse = BaseDepartmentInfo


AddDepartmentRequest = BaseDepartmentInfo


class AddDepartmentMemberRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")


class AddDepartmentMinisterRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")
