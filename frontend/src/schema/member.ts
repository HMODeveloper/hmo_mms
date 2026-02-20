import type { BaseUserInfo } from "@/src/schema/common"

export type { AddMemberRequest, UpdateMemberInfoRequest } from "@/src/schema/request"

export type MemberListResponse = BaseUserInfo[]

export type MemberInfoResponse = BaseUserInfo
