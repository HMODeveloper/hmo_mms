import type { UserInfo } from "@/src/models/user"
import type { AddUserRequest, UpdateUserInfoRequest } from "@/src/types/request"
import request from "@/src/lib/client"

export async function memberList() {
  return await request.get<UserInfo[]>("/member")
}

export async function addMember(req: AddUserRequest) {
  return await request.post("/member", req)
}

export async function removeMember(QQID: string) {
  return await request.delete(`/member/${QQID}`)
}

export async function memberInfo(QQID: string) {
  return await request.get<UserInfo>(`/member/${QQID}`)
}

export async function updateInfo(QQID: string, req: UpdateUserInfoRequest) {
  return await request.put(`/member/${QQID}/info`, req)
}

export async function resetPassword(QQID: string) {
  return await request.put(`/member/${QQID}/password`)
}
