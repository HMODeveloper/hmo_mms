import type { UserInfo } from "@/src/models/user"
import request from "@/src/lib/server"

export async function getUserInfo() {
  return await request.get<UserInfo>("/user/info")
}
