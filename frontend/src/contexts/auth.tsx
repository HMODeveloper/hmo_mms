"use client"

import type { ReactNode } from "react"
import type { Department } from "@/src/models/department"
import type { BaseCollegeInfo, BaseUserInfo } from "@/src/schema/common"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getUserInfo, userLogout } from "@/src/apis/auth"
import { User, USER_LEVEL_MAP } from "@/src/models/user"

export function initUser(
  data: BaseUserInfo,
  getCollege?: (code: string) => BaseCollegeInfo | undefined,
  getDepartment?: (code: string) => Department | null,
): User {
  const college = getCollege?.(data.college)

  return new User({
    ...data,
    college: college
      ? { name: college.name, code: college.code }
      : { name: data.college, code: data.college },
    level: {
      name: USER_LEVEL_MAP[data.level] ?? USER_LEVEL_MAP.MEMBER,
      code: data.level ?? "MEMBER",
    },
    get departments() {
      if (getDepartment) {
        return data.departments.map(d => getDepartment(d.code)).filter(Boolean) as Department[]
      }
      return data.departments.map(d => ({ name: d.name, code: d.code, minister: [], member: [] } as Department))
    },
  })
}

interface AuthContextValue {
  user: User | null
  update: (getCollege?: (code: string) => BaseCollegeInfo | undefined, getDepartment?: (code: string) => Department | null) => void
  logout: () => void
  isAuthenticated: boolean | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  // null: loading
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const update = (
    getCollege?: (code: string) => BaseCollegeInfo | undefined,
    getDepartment?: (code: string) => Department | null,
  ) => {
    setIsAuthenticated(null)
    getUserInfo()
      .then((response) => {
        setUser(initUser(response, getCollege, getDepartment))
        setIsAuthenticated(true)
      })
      .catch(() => {
        setUser(null)
        setIsAuthenticated(false)
      })
  }

  useEffect(() => {
    if (!user && isAuthenticated === null) {
      void update()
    }
    else if (user && isAuthenticated === null) {
      setIsAuthenticated(true)
    }
  }, [user, isAuthenticated])

  const logout = () => {
    setIsAuthenticated(null)
    userLogout()
      .catch(() => console.error("Logout failed"))
      .finally(() => {
        setUser(null)
        setIsAuthenticated(false)
      })
  }

  const value = useMemo(() => ({
    user,
    update,
    logout,
    isAuthenticated,
  }), [user, isAuthenticated])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
