import type { UserInfo } from "@/src/types/response"
import request from "@/src/lib/client"

export interface LoginRequest {
  QQID: string
  password: string
}

export async function userLogin(req: LoginRequest) {
  return await request.post("/login", req)
}

export async function userLogout() {
  return await request.get("/logout")
}

export async function getUserInfo() {
  return await request.get<UserInfo>("/user/info")
}
