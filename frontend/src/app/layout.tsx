import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { getUserInfo } from "@/src/apis/auth.server"
import { AuthProvider, initUser } from "@/src/contexts/auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "湖南大学岳麓幻境社社员管理系统",
}

export default async function ({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await getUserInfo()
    .then(response => initUser(response))
    .catch(() => null)

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
