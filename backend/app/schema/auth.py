from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    qq_id: int = Field(..., alias='QQID')
    password: str


class LoginResponse(BaseModel):
    qq_id: int = Field(..., serialization_alias="QQID")
    mc_name: str = Field(..., serialization_alias="MCName")
    nickname: str
