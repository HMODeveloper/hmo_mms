import type { ChangePasswordRequest, UpdateUserInfoRequest } from "@/src/schema/user"
import request from "@/src/lib/client"

export async function changePassword(req: ChangePasswordRequest) {
  return await request.put("/user/password", req)
}

export async function updateInfo(req: UpdateUserInfoRequest) {
  return await request.put("/user/info", req)
}

export async function removeUser() {
  return await request.delete("/user")
}
