from pydantic import BaseModel, Field


class AddAdminRequest(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")


class AddSuperAdminRequest(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")
