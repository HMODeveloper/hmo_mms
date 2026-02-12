import type { UpdateUserInfoRequest } from "@/src/types/request"
import request from "@/src/lib/client"

export interface ChangePasswordRequest {
  old: string
  new: string
}

export async function changePassword(req: ChangePasswordRequest) {
  return await request.put("/user/password", req)
}

export async function updateInfo(req: UpdateUserInfoRequest) {
  return await request.put("/user/info", req)
}

export async function removeUser() {
  return await request.delete("/user")
}
