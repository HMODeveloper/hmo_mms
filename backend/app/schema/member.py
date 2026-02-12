from typing import List

from app.schema import BaseUserInfo
from app.schema.request import AddMemberRequest, UpdateMemberInfoRequest


MemberListResponse = List[BaseUserInfo]


AddMemberRequest = AddMemberRequest


MemberInfoResponse = BaseUserInfo


UpdateMemberInfoRequest = UpdateMemberInfoRequest
