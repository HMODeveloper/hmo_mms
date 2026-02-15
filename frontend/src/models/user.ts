export interface UserDepartmentInfo {
  name: string
  code: string
}

export type UserLevel = "SUPERADMIN" | "ADMIN" | "MEMBER"

export const USER_LEVEL_MAP: Record<UserLevel, string> = {
  SUPERADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "成员",
}

export interface UserInfo {
  QQID: string
  nickname: string
  mcName?: string
  createAt: string
  realName?: string
  studentID?: string
  college: string
  school?: string
  major?: string
  grade?: number
  classIndex?: number
  departments: UserDepartmentInfo[]
  level: UserLevel
}
