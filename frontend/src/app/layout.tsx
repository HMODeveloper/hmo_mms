import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { getUserInfo } from "@/src/apis/auth.server"
import { AuthProvider } from "@/src/contexts/auth"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "湖南大学岳麓幻境社社员管理系统",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await getUserInfo()
    .then(response => response)
    .catch(() => null)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}  ${geistMono.variable} antialiased`}
      >
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
