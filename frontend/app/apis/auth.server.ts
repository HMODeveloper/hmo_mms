import type { UserInfo } from "~/models/user"
import request from "~/lib/request"

export async function getUserInfo() {
  return await request.get<UserInfo>("/user/info")
}
