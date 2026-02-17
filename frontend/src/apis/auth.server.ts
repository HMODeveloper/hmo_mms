import type { UserInfo } from "@/src/types/response"
import request from "@/src/lib/server"

export async function getUserInfo() {
  return await request.get<UserInfo>("/user/info")
}
