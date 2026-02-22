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

  private readonly _getMinister: () => User[]
  private readonly _getMember: () => User[]

  get minister(): User[] {
    return this._getMinister()
  }

  get member(): User[] {
    return this._getMember()
  }

  constructor(data: DepartmentInterface) {
    this.name = data.name
    this.code = data.code
    this._getMinister = () => data.minister
    this._getMember = () => data.member
  }
}
