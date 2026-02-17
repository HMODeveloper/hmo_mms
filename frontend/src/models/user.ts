import type { DepartmentInterface } from "@/src/models/department"
import type { UserInfo } from "@/src/types/response"
import { Department } from "@/src/models/department"
import { useDepartment } from "@/src/stores/department"

export type UserLevel = "SUPERADMIN" | "ADMIN" | "MEMBER"

export const USER_LEVEL_MAP: Record<UserLevel, string> = {
  SUPERADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "成员",
}

interface LevelInterface {
  code: string
  name: string
}

export interface UserInterface {
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
  departments: DepartmentInterface[]
  level: LevelInterface
}

export class User implements UserInterface {
  _data: UserInfo
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
  departments: DepartmentInterface[] = []
  level: LevelInterface = { code: "MEMBER", name: "成员" }

  constructor(data: UserInfo) {
    this._data = data
    this.QQID = data.QQID
    this.nickname = data.nickname
    this.mcName = data.mcName
    this.createAt = data.createAt
    this.realName = data.realName
    this.studentID = data.studentID
    this.college = data.college
    this.school = data.school
    this.major = data.major
    this.grade = data.grade
    this.classIndex = data.classIndex
    this.departments = data.departments.map(item => new Department({
      name: item.name,
      code: item.code,
      minister: [],
      member: [],
    }))
    this.level = {
      code: data.level,
      name: USER_LEVEL_MAP[data.level] || data.level,
    }
  }

  loadAssociations() {
    const { departments } = useDepartment()
    const codes = new Set(this.departments.map(item => item.code))
    this.departments = departments.filter(item => codes.has(item.code))
  }
}
