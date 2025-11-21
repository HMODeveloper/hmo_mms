from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    qq_id: int = Field(..., alias='QQID')
    password: str


class LoginResponse(BaseModel):
    user_id: int = Field(..., serialization_alias='userID')
    nickname: str
    token: str
