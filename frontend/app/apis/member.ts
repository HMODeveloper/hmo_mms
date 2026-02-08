import request from "~/lib/client"

export interface AddMemberRequest {
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

export interface UpdateInfoRequest {
  nickname?: string
  mcName?: string
  realName?: string
  studentID?: string
  collegeCode?: string
  collegeName?: string
  major?: string
  grade?: number
  classIndex?: number
}

export async function memberList() {
  return await request.get("/member")
}

export async function addMember(req: AddMemberRequest) {
  return await request.post("/member", req)
}

export async function removeMember(QQID: number) {
  return await request.delete(`/member/${QQID}`)
}

export async function memberInfo(QQID: number) {
  return await request.get(`/member/${QQID}`)
}

export async function updateInfo(QQID: number, req: UpdateInfoRequest) {
  return await request.put(`/member/${QQID}/info`, req)
}

export async function resetPassword(QQID: number) {
  return await request.put(`/member/${QQID}/password`)
}
