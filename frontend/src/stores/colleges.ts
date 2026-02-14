import type { CollegeInfo } from "@/src/models/college"
import { useEffect } from "react"
import { create } from "zustand"
import { getCollegesInfo } from "@/src/apis/public"

interface CollegeStore {
  colleges: CollegeInfo[]
  loading: boolean
  error: Error | null

  fetchCollegeInfo: () => Promise<void>
}

const useCollegeStore = create<CollegeStore>(set => ({
  colleges: [],
  loading: false,
  error: null,
  fetchCollegeInfo: async () => {
    set({ loading: true, error: null })

    try {
      const response = await getCollegesInfo()
      set({ colleges: response, loading: false })
    }
    catch (error) {
      set({ error: error as Error, loading: false })
    }
  },
}))

export function useColleges() {
  const { colleges, loading, error, fetchCollegeInfo } = useCollegeStore()

  useEffect(() => {
    if (colleges.length === 0 && !loading) {
      void fetchCollegeInfo()
    }
  }, [])

  return { colleges, loading, error }
}
