from pydantic import BaseModel
from app.schema.request import AddMemberRequest

from app.schema import BaseCollegeInfo


class SignUpInfoResponse(BaseModel):
    colleges: list[BaseCollegeInfo]


SignUpRequest = AddMemberRequest
