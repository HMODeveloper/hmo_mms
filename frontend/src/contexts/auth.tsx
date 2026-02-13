"use client"

import type { ReactNode } from "react"
import type { UserInfo } from "@/src/models/user"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

import { getUserInfo, userLogout } from "@/src/apis/auth"

interface AuthContextValue {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser?: UserInfo | null
}) {
  const [user, setUser] = useState<UserInfo | null>(initialUser)

  useEffect(() => {
    if (!user) {
      getUserInfo()
        .then(response => setUser(response))
        .catch(() => setUser(null))
    }
  }, [user])

  const logout = () => {
    userLogout()
      .catch(() => console.error("Logout failed"))
      .finally(() => setUser(null))
  }

  const value = useMemo(() => ({ user, setUser, logout }), [user])

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
