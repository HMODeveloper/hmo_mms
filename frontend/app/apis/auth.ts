import type { UserInfo } from "~/model/user"

export interface LoginRequest {
  qq_id: number
  password: string
}

export type LoginResponse = UserInfo

// TODO: 封装 request
// TODO: 封装字段转换
