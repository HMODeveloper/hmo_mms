import type { UpdateMemberInfoRequest } from "@/src/schema/request"

export interface ChangePasswordRequest {
  old: string
  new: string
}

export type UpdateUserInfoRequest = UpdateMemberInfoRequest
