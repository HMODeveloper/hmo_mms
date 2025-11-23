import request from "~/apis/request"

export interface CollegeInfo {
  name: string
  code: string
}

interface CollegeListResponse {
  colleges: CollegeInfo[]
}

interface CheckQQRequest {
  qq_id: number
}

interface CheckQQResponse {
  qq_id: number
}

export interface SignUpRequest {
  QQID: number
  nickname: string
  password: string
  MCName?: string
  realName: string
  studentID: string
  collegeName: string
  major?: string
  grade?: number
  classIndex?: number
}

export const getCollegeListAPI = () => {
  return request.get<CollegeListResponse>("/signup/info")
}

export const checkQQAPI = (data: CheckQQRequest) => {
  return request.get<CheckQQResponse>("/signup/check_qq", data)
}

export const signUpAPI = (data: SignUpRequest) => {
  console.log(data)
  return request.post<SignUpRequest>("/signup", data)
}
