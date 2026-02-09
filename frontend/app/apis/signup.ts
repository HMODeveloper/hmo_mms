export interface SignUpRequest {
  QQID: number
  nickname: string
  password: string
  mcMame: string
  realName: string
  studentID: string
  collegeCode: string
  collegeName: string
  major: string
  grade: number
  classIndex: number
}

export async function getSignUpInfo() {
  return await useRequest().get("/signup")
}

export async function checkQQ(QQID: number) {
  return await useRequest().get("/signup/check", { qq_id: QQID })
}

export async function signUp(req: SignUpRequest) {
  return await useRequest().post("/signup", req)
}
