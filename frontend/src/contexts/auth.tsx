"use client"

import type { ReactNode } from "react"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getUserInfo, userLogout } from "@/src/apis/auth"

import { User } from "@/src/models/user"

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
  update: () => void
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

  const update = () => {
    setIsAuthenticated(null)
    getUserInfo()
      .then((response) => {
        setUser(new User(response))
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
    setUser,
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
