from pydantic import BaseModel, Field

from app.schema import BaseUserInfo


class LoginRequest(BaseModel):
    qq_id: str = Field(..., alias="QQID")
    password: str


UserInfoResponse = BaseUserInfo
