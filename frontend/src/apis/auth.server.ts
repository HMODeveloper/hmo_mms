import type { UserInfoResponse } from "@/src/schema/auth"
import request from "@/src/lib/server"

export async function getUserInfo() {
  return await request.get<UserInfoResponse>("/user/info")
}
