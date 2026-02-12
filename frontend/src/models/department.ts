import type { UserInfo } from "@/src/models/user"

export interface DepartmentInfo {
  name: string
  code: string
  minister: number[]
  member: UserInfo[]
}
