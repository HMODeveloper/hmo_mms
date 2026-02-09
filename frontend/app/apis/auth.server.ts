import type { UserInfo } from "~/models/user"
import request from "~/lib/server"

export async function getUserInfo() {
  return await request.get<UserInfo>("/user/info")
}
