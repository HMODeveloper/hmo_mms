import type { CollegeInfo } from "~/models/college"
import request from "~/apis/request"

export interface SignUpRequest {
  QQID: number
  nickname: string
  password: string
  mcMame?: string
  realName: string
  studentID?: string
  college: string
  school?: string
  major?: string
  grade?: number
  classIndex?: number
}

export interface SignUpInfoResponse {
  colleges: CollegeInfo[]
}

export async function getSignUpInfo() {
  return await request.get<SignUpInfoResponse>("/signup")
}

export async function checkQQ(QQID: number) {
  return await request.get("/signup/check", { qq_id: QQID })
}

export async function signUp(req: SignUpRequest) {
  return await request.post("/signup", req)
}
