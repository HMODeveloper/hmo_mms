import request from "~/apis/request"

interface DepartmentInfo {
  name: string
  code: string
}

export interface GetProfileResponse {
  QQID: number
  MCName: string
  nickname: string
  createAt: string
  realName: string
  studentID: string
  collegeName: string
  major: string
  grade: number
  classIndex: number
  departments: DepartmentInfo[]
  level: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export const getProfileAPI = () => {
  return request.get<GetProfileResponse>("/profile")
}

export const changePasswordAPI = (data: ChangePasswordRequest) => {
  return request.put("/profile/change_password", data)
}
