import type { LoginRequest, UserInfoResponse } from "@/src/schema/auth"
import request from "@/src/lib/client"

export async function userLogin(req: LoginRequest) {
  return await request.post("/login", req)
}

export async function userLogout() {
  return await request.get("/logout")
}

export async function getUserInfo() {
  return await request.get<UserInfoResponse>("/user/info")
}
