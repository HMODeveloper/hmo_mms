import type { BaseUserInfo } from "@/src/schema/common"
import { create } from "zustand"

export type StoreMember = BaseUserInfo

interface Store {
  data: Map<string, BaseUserInfo>
  setmembers: (departments: BaseUserInfo[]) => void
  getMember: (code: string) => BaseUserInfo | undefined
  getAllMembers: () => BaseUserInfo[]
}

export const useMemberStore = create<Store>((set, get) => ({
  data: new Map(),
  setmembers: departments => set({
    data: new Map(departments.map(item => [item.QQID, item])),
  }),
  getMember: QQID => get().data.get(QQID),
  getAllMembers: () => Array.from(get().data.values()),
}))
