import type { User } from "@/src/models/user"
import type { DepartmentInfo } from "@/src/types/response"

export interface DepartmentInterface {
  name: string
  code: string
  minister: User[]
  member: User[]
}

export class Department implements DepartmentInterface {
  _data: DepartmentInfo
  name: string
  code: string
  minister: User[]
  member: User[]

  constructor(data: DepartmentInfo) {
    this._data = data
    this.name = data.name
    this.code = data.code
    this.minister = []
    this.member = []
  }

  loadAssociations(members: User[]) {
    const ministerSet = new Set(this._data.minister)
    const memberSet = new Set(this._data.member)

    this.minister = members.filter(item => ministerSet.has(item.QQID))
    this.member = members.filter(item => memberSet.has(item.QQID))
  }
}
