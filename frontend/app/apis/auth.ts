import request from "~/apis/request"

export interface LoginRequest {
  QQID: number
  password: string
}

export interface LoginResponse {
  QQID: string
  MCName: string
  nickname: string
}

export const loginAPI = (data: LoginRequest) => {
  return request.post<LoginResponse>("/login", data)
}

export const logoutAPI = () => {
  return request.get("/logout")
}
