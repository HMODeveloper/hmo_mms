import type { CollegeInfo } from "@/src/models/college"
import type { DepartmentInterface } from "@/src/models/department"
import type { UserInfo } from "@/src/types/response"
import dayjs from "dayjs"
import { Department } from "@/src/models/department"

export type UserLevel = "SUPERADMIN" | "ADMIN" | "MEMBER"

export const USER_LEVEL_MAP: Record<UserLevel, string> = {
  SUPERADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "成员",
}

interface CollegeInterface {
  name: string
  code: string
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
  college: CollegeInterface
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
  college: CollegeInterface = { name: "错误", code: "ERROR" }
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
    this.college = {
      name: data.college,
      code: data.college,
    }
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

  loadAssociations(colleges: CollegeInfo[], departments: Department[]) {
    const college = colleges.find(item => item.code === this.college.code)
    this.college = {
      name: college ? college.name : this.college.name,
      code: this.college.code,
    }

    const codes = new Set(this.departments.map(item => item.code))
    this.departments = departments.filter(item => codes.has(item.code))
  }

  get isAdmin(): boolean {
    return this.level.code === "SUPERADMIN" || this.level.code === "ADMIN"
  }

  get formattedCreateAt(): string {
    return this.createAt ? dayjs(this.createAt).format("YYYY-MM-DD") : "---"
  }

  get formattedDepartments(): string {
    return this.departments.length > 0
      ? this.departments.map(item => item.name).join(", ")
      : "无"
  }

  get formattedMajorClass(): string {
    if (!this.grade || !this.classIndex || !this.major) {
      return "---"
    }
    const yy = this.grade.toString().slice(-2)
    const index = this.classIndex.toString().padStart(2, "0")
    return `${this.major}${yy}${index}`
  }
}
