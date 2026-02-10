import request from "~/apis/request"

export interface ChangePasswordRequest {
  old: string
  new: string
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

export async function changePassword(req: ChangePasswordRequest) {
  return await request.put("/user/password", req)
}

export async function updateInfo(req: UpdateInfoRequest) {
  return await request.put("/user/info", req)
}

export async function removeUser() {
  return await request.delete("/user")
}
