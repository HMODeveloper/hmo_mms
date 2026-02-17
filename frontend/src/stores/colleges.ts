"use client"

import type { CollegeInfo } from "@/src/models/college"
import { useEffect } from "react"
import { create } from "zustand"
import { getCollegesInfo } from "@/src/apis/public"

interface CollegeStore {
  colleges: CollegeInfo[]
  loading: boolean
  error: Error | null

  setColleges: (colleges: CollegeInfo[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

const useCollegeStore = create<CollegeStore>(set => ({
  colleges: [],
  loading: false,
  error: null,
  setColleges: colleges => set({ colleges }),
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

export function useColleges() {
  const { colleges, loading, error, setColleges, setLoading, setError } = useCollegeStore()

  const update = async () => {
    setLoading(true)
    try {
      const response = await getCollegesInfo()
      setColleges(response)
    }
    catch (error) {
      setError(error instanceof Error ? error : new Error("学院信息加载失败"))
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (colleges.length === 0 && !loading) {
      void update()
    }
  }, [])

  return {
    colleges,
    loading,
    error,
    update,
  }
}
