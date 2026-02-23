import type { Department } from "@/src/models/department"
import dayjs from "dayjs"

export type UserLevel = "SUPERADMIN" | "ADMIN" | "MEMBER"

export const USER_LEVEL_MAP: Record<UserLevel, string> = {
  SUPERADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "成员",
}

export interface UserInterface {
  QQID: string
  nickname: string
  mcName?: string
  createAt: string
  realName?: string
  studentID?: string
  college: {
    name: string
    code: string
  }
  school?: string
  major?: string
  grade?: number
  classIndex?: number
  level: {
    name: string
    code: UserLevel
  }
  departments: Department[]
}

export class User implements UserInterface {
  QQID: string
  nickname: string
  mcName?: string
  createAt: string
  realName?: string
  studentID?: string
  college: {
    name: string
    code: string
  }

  school?: string
  major?: string
  grade?: number
  classIndex?: number
  level: {
    name: string
    code: UserLevel
  }

  private readonly _getDepartments: () => Department[]

  get departments(): Department[] {
    return this._getDepartments()
  }

  constructor(data: UserInterface) {
    this.QQID = data.QQID
    this.nickname = data.nickname
    this.mcName = data.mcName
    this.createAt = data.createAt
    this.realName = data.realName
    this.studentID = data.studentID
    this.college = { ...data.college }
    this.school = data.school
    this.major = data.major
    this.grade = data.grade
    this.classIndex = data.classIndex
    this.level = { ...data.level }
    this._getDepartments = () => data.departments
  }

  get isSuperAdmin(): boolean {
    return this.level.code === "SUPERADMIN"
  }

  get isPureAdmin(): boolean {
    return this.level.code === "ADMIN"
  }

  get isAdmin(): boolean {
    return this.isSuperAdmin || this.isPureAdmin
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

  isMinister(code: string): boolean {
    return this.departments.find(item => item.code === code)?.minister.some(item => item.QQID === this.QQID) || this.isSuperAdmin
  }
}
