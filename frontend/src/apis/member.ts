import type { AddMemberRequest, MemberInfoResponse, MemberListResponse, UpdateMemberInfoRequest } from "@/src/schema/member"
import request from "@/src/lib/client"

export async function memberList() {
  return await request.get<MemberListResponse>("/member")
}

export async function addMember(req: AddMemberRequest) {
  return await request.post("/member", req)
}

export async function removeMember(QQID: string) {
  return await request.delete(`/member/${QQID}`)
}

export async function memberInfo(QQID: string) {
  return await request.get<MemberInfoResponse>(`/member/${QQID}`)
}

export async function updateInfo(QQID: string, req: UpdateMemberInfoRequest) {
  return await request.put(`/member/${QQID}/info`, req)
}

export async function resetPassword(QQID: string) {
  return await request.put(`/member/${QQID}/password`)
}
