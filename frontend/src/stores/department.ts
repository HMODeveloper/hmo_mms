"use client"

import { useEffect } from "react"
import { create } from "zustand"
import { departmentInfo, departmentList } from "@/src/apis/department"
import { Department } from "@/src/models/department"

interface DepartmentStore {
  departments: Department[]
  loading: boolean
  error: Error | null

  setDepartments: (departments: Department[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

const useDepartmentStore = create<DepartmentStore>(set => ({
  departments: [],
  loading: false,
  error: null,
  setDepartments: departments => set({ departments }),
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

export function useDepartment() {
  const { departments, loading, error, setDepartments, setLoading, setError } = useDepartmentStore()

  const update = async (code?: string) => {
    setLoading(true)
    try {
      if (code) {
        const response = await departmentInfo(code)
        setDepartments(departments.map(item => item.code === code ? new Department(response) : item))
      }
      else {
        const response = await departmentList()
        setDepartments(response.map(item => new Department(item)))
      }
    }
    catch (error) {
      setError(error instanceof Error ? error : new Error("部门信息加载失败"))
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (departments.length === 0 && !loading) {
      void update()
    }
  }, [])

  return {
    departments,
    loading,
    error,
    update,
    setDepartments,
  }
}
