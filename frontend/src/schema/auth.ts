import type { BaseUserInfo } from "@/src/schema/common"

export interface LoginRequest {
  QQID: string
  password: string
}

export type UserInfoResponse = BaseUserInfo
