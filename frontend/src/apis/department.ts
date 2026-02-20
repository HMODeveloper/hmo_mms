import type { AddDepartmentRequest, DepartmentInfoResponse, DepartmentListResponse } from "@/src/schema/department"
import request from "@/src/lib/client"

export async function departmentList() {
  return await request.get<DepartmentListResponse>("/department")
}

export async function addDepartment(req: AddDepartmentRequest) {
  return await request.post("/department", req)
}

export async function removeDepartment(code: string) {
  return await request.delete(`/department/${code}`)
}

export async function departmentInfo(code: string) {
  return await request.get<DepartmentInfoResponse>(`/department/${code}`)
}

export async function addDepartmentMember(code: string, QQID: string) {
  return await request.post(`/department/${code}/member`, { QQID })
}

export async function removeDepartmentMember(code: string, QQID: string) {
  return await request.delete(`/department/${code}/member/${QQID}`)
}

export async function addDepartmentMinister(code: string, QQID: string) {
  return await request.post(`/department/${code}/minister`, { QQID })
}

export async function removeDepartmentMinister(code: string, QQID: string) {
  return await request.delete(`/department/${code}/minister/${QQID}`)
}
