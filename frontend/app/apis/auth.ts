import type { UserInfo } from "~/models/user"

export interface LoginRequest {
  QQID: number
  password: string
}

export type LoginResponse = UserInfo

export async function userLogin(req: LoginRequest) {
  return await useRequest().post("/login", req)
}

export async function userLogout() {
  return await useRequest().get("/logout")
}

export async function getUserInfo() {
  return await useRequest().get<UserInfo>("/user/info")
}
