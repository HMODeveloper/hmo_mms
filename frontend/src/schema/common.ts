import type { UserLevel } from "@/src/models/user"

export interface BaseUserDrpartment {
  code: string
  name: string
}

export interface BaseUserInfo {
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
  departments: BaseUserDrpartment[]
  level: UserLevel
}

export interface BaseDepartmentInfo {
  name: string
  code: string
  minister: string[]
  member: string[]
}

export interface BaseCollegeInfo {
  name: string
  code: string
}
