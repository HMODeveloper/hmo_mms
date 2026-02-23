from pydantic import BaseModel, Field


class AddAdminRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")


class AddSuperAdminRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")
