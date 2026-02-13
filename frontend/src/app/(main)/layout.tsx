"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "@/src/components/navbar"
import { useAuth } from "@/src/contexts/auth"

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false) {
      void router.replace("/")
    }
  }, [isAuthenticated, router])

  // 在鉴权检查期间显示加载状态
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
      <div className="flex flex-1 w-full overflow-y-scroll items-start justify-center pt-4 md:pt-8 px-4 lg:px-16">
        {children}
      </div>
    </div>
  )
}
