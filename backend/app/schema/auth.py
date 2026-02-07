from pydantic import BaseModel, Field

from app.schema import BaseUserInfo


class LoginRequest(BaseModel):
    qq_id: int = Field(..., alias="QQID")
    password: str


UserInfoResponse = BaseUserInfo
