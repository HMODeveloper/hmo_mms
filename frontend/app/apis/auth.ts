import type { UserInfo } from "~/models/user"
import request from "~/lib/client"

export interface LoginRequest {
  QQID: number
  password: string
}

export type LoginResponse = UserInfo

export async function login(req: LoginRequest) {
  return await request.post("/login", req)
}

export async function logout() {
  return await request.get("/logout")
}

export async function getUserInfo() {
  return await request.get<UserInfo>("/userinfo")
}
