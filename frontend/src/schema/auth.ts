import type { BaseUserInfo } from "@/src/schema/response"

export interface LoginRequest {
  QQID: string
  password: string
}

export type UserInfoResponse = BaseUserInfo
