import type { SignUpRequest } from "@/src/schema/signup"
import request from "@/src/lib/client"

export async function checkQQ(QQID: string) {
  return await request.get("/signup/check", { qq_id: QQID })
}

export async function signUp(req: SignUpRequest) {
  return await request.post("/signup", req)
}
