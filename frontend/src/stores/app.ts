import type { UserInterface } from "@/src/models/user"
import { useEffect } from "react"
import { create } from "zustand"
import { departmentList } from "@/src/apis/department"
import { memberList } from "@/src/apis/member"
import { getCollegesInfo } from "@/src/apis/public"
import { Department } from "@/src/models/department"
import { User, USER_LEVEL_MAP } from "@/src/models/user"
import { useCollegeStore } from "@/src/stores/college"
import { useDepartmentStore } from "@/src/stores/department"
import { useMemberStore } from "@/src/stores/member"

interface Store {
  initialized: boolean
  loading: boolean
  membersLoading: boolean
  departmentsLoading: boolean
  collegesLoading: boolean
  setInitialized: (value: boolean) => void
  setLoading: (value: boolean) => void
  setMembersLoading: (value: boolean) => void
  setDepartmentsLoading: (value: boolean) => void
  setCollegesLoading: (value: boolean) => void
}

const useAppStore = create<Store>(set => ({
  initialized: false,
  loading: false,
  membersLoading: false,
  departmentsLoading: false,
  collegesLoading: false,
  setInitialized: value => set({ initialized: value }),
  setLoading: value => set({ loading: value }),
  setMembersLoading: value => set({ membersLoading: value }),
  setDepartmentsLoading: value => set({ departmentsLoading: value }),
  setCollegesLoading: value => set({ collegesLoading: value }),
}))

export function useAppData() {
  const memberStore = useMemberStore()
  const departmentStore = useDepartmentStore()
  const collegeStore = useCollegeStore()
  const { initialized, loading, membersLoading, departmentsLoading, collegesLoading, setInitialized, setLoading, setMembersLoading, setDepartmentsLoading, setCollegesLoading } = useAppStore()

  async function updateMembers() {
    if (membersLoading)
      return
    setMembersLoading(true)
    try {
      const response = await memberList()
      useMemberStore.getState().setmembers(response)
    }
    finally {
      setMembersLoading(false)
    }
  }

  async function updateDepartments() {
    if (departmentsLoading)
      return
    setDepartmentsLoading(true)
    try {
      const response = await departmentList()
      useDepartmentStore.getState().setDepartments(response)
    }
    finally {
      setDepartmentsLoading(false)
    }
  }

  async function updateColleges() {
    if (collegesLoading)
      return
    setCollegesLoading(true)
    try {
      const response = await getCollegesInfo()
      useCollegeStore.getState().setColleges(response)
    }
    finally {
      setCollegesLoading(false)
    }
  }

  async function init() {
    if (loading)
      return
    setLoading(true)
    await Promise.all([
      updateMembers(),
      updateDepartments(),
      updateColleges(),
    ]).finally(() => {
      setInitialized(true)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!initialized)
      void init()
  }, [initialized])

  function getMember(QQID: string): User | null {
    const raw = memberStore.getMember(QQID)
    if (!raw)
      return null

    const college = getCollege(raw.college)
    if (!college)
      return null

    const user: UserInterface = {
      QQID: raw.QQID,
      nickname: raw.nickname,
      mcName: raw.mcName,
      createAt: raw.createAt,
      realName: raw.realName,
      studentID: raw.studentID,
      college: {
        name: college.name,
        code: college.code,
      },
      school: raw.school,
      major: raw.major,
      grade: raw.grade,
      classIndex: raw.classIndex,
      level: {
        name: USER_LEVEL_MAP[raw.level] ?? USER_LEVEL_MAP.MEMBER,
        code: raw.level ?? "MEMBER",
      },
      get departments() {
        return raw.departments.map(item => getDepartment(item.code)).filter(Boolean) as Department[]
      },
    }
    return new User(user)
  }

  function getDepartment(code: string): Department | null {
    const raw = departmentStore.getDepartment(code)
    if (!raw)
      return null

    const department: Department = {
      name: raw.name,
      code: raw.code,
      get member() {
        return raw.member.map(QQID => getMember(QQID)).filter(Boolean) as User[]
      },
      get minister() {
        return raw.minister.map(QQID => getMember(QQID)).filter(Boolean) as User[]
      },
    }
    return new Department(department)
  }

  function getCollege(code: string) {
    return collegeStore.getCollege(code)
  }

  function getAllMembers(): User[] {
    return memberStore.getAllMembers().map(item => getMember(item.QQID)).filter(Boolean) as User[]
  }

  function getAllDepartments(): Department[] {
    return departmentStore.getAllDepartments().map(item => getDepartment(item.code)).filter(Boolean) as Department[]
  }

  function getAllColleges() {
    return collegeStore.getAllColleges()
  }

  return {
    initialized,
    loading,
    init,
    updateMembers,
    updateDepartments,
    updateColleges,
    getMember,
    getDepartment,
    getCollege,
    getAllMembers,
    getAllDepartments,
    getAllColleges,
  }
}
