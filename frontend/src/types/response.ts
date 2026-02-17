import type { UserLevel } from "@/src/models/user"

export interface DepartmentInfo {
  name: string
  code: string
  minister: string[]
  member: string[]
}

export interface UserDepartmentInfo {
  name: string
  code: string
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
