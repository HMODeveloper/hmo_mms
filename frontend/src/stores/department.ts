import type { BaseDepartmentInfo } from "@/src/schema/common"
import { create } from "zustand"

export type StoreDepartment = BaseDepartmentInfo

interface Store {
  data: Map<string, StoreDepartment>
  setDepartments: (departments: StoreDepartment[]) => void
  getDepartment: (code: string) => StoreDepartment | undefined
  getAllDepartments: () => StoreDepartment[]
}

export const useDepartmentStore = create<Store>((set, get) => ({
  data: new Map(),
  setDepartments: departments => set({
    data: new Map(departments.map(item => [item.code, item])),
  }),
  getDepartment: code => get().data.get(code),
  getAllDepartments: () => Array.from(get().data.values()),
}))
