interface DepartmentInfo {
  name: string
  code: string
}

export interface UserInfo {
  qq_id: number
  nickname: string
  mc_name: string
  create_at: string
  real_name: string
  student_id: string
  college_name: string
  major: string
  grade: number
  class_index: number
  departments: DepartmentInfo[]
  level: "superadmin" | "admin" | "member"
}
