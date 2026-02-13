"use client"

import type { ReactNode } from "react"
import type { UserInfo } from "@/src/models/user"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

import { getUserInfo, userLogout } from "@/src/apis/auth"

interface AuthContextValue {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  logout: () => void
  isAuthenticated: boolean | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser: UserInfo | null
}) {
  const [user, setUser] = useState<UserInfo | null>(initialUser)
  // null: loading
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user && isAuthenticated === null) {
      getUserInfo()
        .then((response) => {
          setUser(response)
          setIsAuthenticated(true)
        })
        .catch(() => {
          setUser(null)
          setIsAuthenticated(false)
        })
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

  const value = useMemo(() => ({ user, setUser, logout, isAuthenticated }), [user, isAuthenticated])

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
