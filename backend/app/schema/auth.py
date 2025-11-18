from pydantic import BaseModel


class LoginRequest(BaseModel):
    qq_id: int
    password: str


class LoginResponse(BaseModel):
    user_id: int
    nickname: str
    token: str
