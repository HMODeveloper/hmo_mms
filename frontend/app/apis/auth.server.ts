import type { UserInfo } from "~/models/user"
import serverRequest from "~/lib/server"

export async function getUserInfo() {
  return await serverRequest.get<UserInfo>("/user/info")
}
