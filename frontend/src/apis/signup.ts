import type { AddUserRequest } from "@/src/types/request"
import request from "@/src/lib/client"

export async function checkQQ(QQID: number) {
  return await request.get("/signup/check", { qq_id: QQID })
}

export async function signUp(req: AddUserRequest) {
  return await request.post("/signup", req)
}
