from pydantic import BaseModel

from app.schema import BaseUserInfo


class LoginRequest(BaseModel):
    qq_id: int
    password: str


class UserInfoResponse(BaseUserInfo): ...
