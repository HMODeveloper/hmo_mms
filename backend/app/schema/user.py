from pydantic import BaseModel
from app.schema.request import UpdateMemberInfoRequest


class ChangePasswordRequest(BaseModel):
    old: str
    new: str


UpdateMemberInfoRequest = UpdateMemberInfoRequest
