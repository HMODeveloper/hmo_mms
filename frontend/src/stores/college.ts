import type { BaseCollegeInfo } from "@/src/schema/common"
import { create } from "zustand"

export type StoreCollege = BaseCollegeInfo

interface Store {
  data: Map<string, StoreCollege>
  setColleges: (colleges: StoreCollege[]) => void
  getCollege: (code: string) => StoreCollege | undefined
  getAllColleges: () => StoreCollege[]
}

export const useCollegeStore = create<Store>((set, get) => ({
  data: new Map(),
  setColleges: colleges => set({
    data: new Map(colleges.map(item => [item.code, item])),
  }),
  getCollege: code => get().data.get(code),
  getAllColleges: () => Array.from(get().data.values()),
}))
