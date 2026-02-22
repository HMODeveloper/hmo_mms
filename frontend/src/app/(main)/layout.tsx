"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import BreadNav from "@/src/components/bread-nav"
import Navbar from "@/src/components/navbar"
import { useAuth } from "@/src/contexts/auth"
import { useAppData } from "@/src/stores/app"

export default function ({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { isAuthenticated, update } = useAuth()
  const { initialized, getCollege, getDepartment } = useAppData()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (initialized && isAuthenticated === true) {
      void update(getCollege, getDepartment)
    }
  }, [initialized])

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <h3 className="text-3xl font-semibold">Loading...</h3>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen items-center">
      <Navbar />
      <div className="flex-1 flex w-full overflow-y-scroll items-start justify-center py-4 px-4 lg:px-16">
        <div className="w-full max-w-6xl flex flex-col gap-4">
          <BreadNav />
          {children}
        </div>
      </div>
    </div>
  )
}
