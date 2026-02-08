export interface DepartmentInfo {
  name: string
  code: string
}

export interface UserInfo {
  QQID: number
  nickname: string
  mcName: string
  createAt: string
  realName: string
  studentID: string
  collegeName: string
  major: string
  grade: number
  classIndex: number
  departments: DepartmentInfo[]
  level: "superadmin" | "admin" | "member"
}
