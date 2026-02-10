export interface DepartmentInfo {
  name: string
  code: string
}

export type UserLevel = "superadmin" | "admin" | "member"

export interface UserInfo {
  QQID: number
  nickname: string
  mcName: string
  createAt: string
  realName: string
  studentID: string
  college: string
  school: string
  major: string
  grade: number
  classIndex: number
  departments: DepartmentInfo[]
  level: UserLevel
}
