import type { UserInfo } from "@/src/models/user"
import { useEffect } from "react"
import { create } from "zustand"
import { memberList } from "@/src/apis/member"

interface MemberStore {
  members: UserInfo[]
  loading: boolean
  error: Error | null

  fetchMembers: () => Promise<void>
}

const useMemberStore = create<MemberStore>(set => ({
  members: [],
  loading: false,
  error: null,
  fetchMembers: async () => {
    set({ loading: true, error: null })

    try {
      const response = await memberList()
      set({ members: response, loading: false })
    }
    catch (error) {
      set({ error: error as Error, loading: false })
    }
  },
}))

export function useMembers() {
  const { members, loading, error, fetchMembers } = useMemberStore()

  useEffect(() => {
    if (members.length === 0 && !loading) {
      void fetchMembers()
    }
  }, [])

  const refreshMembers = fetchMembers

  return { members, loading, error, refreshMembers }
}
