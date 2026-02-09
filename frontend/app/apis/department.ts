import type { DepartmentInfo, UserInfo } from "~/models/user"

export interface AddMemberRequest {
  name: string
  code: string
  minister: number
  member: number
}

export interface DepartmentInfoResponse {
  name: string
  code: string
  minister: number[]
  member: UserInfo[]
}

export async function departmentList() {
  return await useRequest().get<DepartmentInfo[]>("/department")
}

export async function addDepartment(req: AddMemberRequest) {
  return await useRequest().post("/department", req)
}

export async function removeDepartment(code: string) {
  return await useRequest().delete(`/department/${code}`)
}

export async function departmentInfo(code: string) {
  return await useRequest().get<DepartmentInfoResponse>(`/department/${code}`)
}

export async function addDepartmentMember(code: string, QQID: number) {
  return await useRequest().post(`/department/${code}/member`, { QQID })
}

export async function removeDepartmentMember(code: string, QQID: number) {
  return await useRequest().delete(`/department/${code}/member/${QQID}`)
}

export async function addDepartmentMinister(code: string, QQID: number) {
  return await useRequest().post(`/department/${code}/minister`, { QQID })
}

export async function removeDepartmentMinister(code: string, QQID: number) {
  return await useRequest().delete(`/department/${code}/minister/${QQID}`)
}
