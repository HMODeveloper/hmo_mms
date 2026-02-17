"use client"

import { useEffect } from "react"
import { create } from "zustand"
import { memberList } from "@/src/apis/member"
import { User } from "@/src/models/user"
import { useColleges } from "@/src/stores/colleges"
import { useDepartment } from "@/src/stores/department"

interface MemberStore {
  members: User[]
  loading: boolean
  error: Error | null

  setMembers: (members: User[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

const useMemberStore = create<MemberStore>(set => ({
  members: [],
  loading: false,
  error: null,
  setMembers: members => set({ members }),
  setLoading: (loading) => {
    if (loading) {
      set({ loading: true, error: null })
    }
    else {
      set({ loading: false })
    }
  },
  setError: (error: Error | null) => set({ error }),
}))

export function useMember() {
  const { members, loading, error, setMembers, setLoading, setError } = useMemberStore()
  const { departments } = useDepartment()
  const { colleges } = useColleges()

  const update = async () => {
    setLoading(true)
    try {
      const response = await memberList()
      setMembers(response.map((item) => {
        const user = new User(item)
        user.loadAssociations(colleges, departments)
        return user
      }))
    }
    catch (error) {
      setError(error instanceof Error ? error : new Error("成员信息加载失败"))
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (members.length === 0 && !loading) {
      void update()
    }
  }, [])

  return {
    members,
    loading,
    error,
    update,
    setMembers,
  }
}
