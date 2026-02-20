import type { User } from "@/src/models/user"

export interface DepartmentInterface {
  name: string
  code: string
  readonly minister: User[]
  readonly member: User[]
}

export class Department implements DepartmentInterface {
  name: string
  code: string
  minister: User[]
  member: User[]

  constructor(data: DepartmentInterface) {
    this.name = data.name
    this.code = data.code
    this.minister = data.minister
    this.member = data.member
  }
}
