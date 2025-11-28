import request from "~/apis/request"

interface DepartmentInfo {
  name: string
  code: string
}

export interface MemberInfo {
  QQID: number
  MCName: string
  nickname: string
  createAt: string
  realName: string
  studentID: string
  collegeName: string
  major: string
  grade: number
  classIndex: number
  departments: DepartmentInfo[]
  level: string
}

interface MemberListResponse {
  members: MemberInfo[]
  total: number
}

interface CollegeInfo {
  name: string
  code: string
}

interface DepartmentInfo {
  name: string
  code: string
}

interface UserLevelInfo {
  level: string
  code: string
}

export interface SearchInfoRespons {
  colleges: CollegeInfo[]
  departments: DepartmentInfo[]
  levels: UserLevelInfo[]
}

export interface SearchRequest {
  globalQuery?: string
  createAtStart?: string
  createAtEnd?: string
  colleges?: string[]
  departments?: string[]
  levels?: string[]
  pageSize?: number
  pageIndex?: number
}

export const getSearchInfoAPI = () => {
  return request.get<SearchInfoRespons>("/member/info")
}

export const memberSearchAPI = (data: SearchRequest) => {
  return request.post<MemberListResponse>("/member/search", data)
}
