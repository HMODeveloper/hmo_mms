"use client"

import {
  IconLogout,
  IconUser,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/src/contexts/auth"

interface NavItem {
  href: string
  label: string
}

export default function () {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!user) {
    return <></>
  }

  // 导航链接配置
  const navItems: NavItem[] = [
    { href: "/dashboard", label: "首页" },
    { href: "/member", label: "成员管理" },
    user.isAdmin && { href: "/department", label: "部门管理" },
    user.level.code === "SUPERADMIN" && { href: "/superadmin", label: "超管功能" },
    { href: "/user", label: "个人中心" },
  ].filter(Boolean) as NavItem[]

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="w-full py-2 md:py-4 shadow-md flex items-center justify-between px-4 md:px-8 bg-white">
      {/* 左侧标题 */ }
      <div className="flex items-center">
        <Link
          href="/dashboard"
          className="text-lg md:text-xl font-bold text-gray-900 hover:text-primary transition-colors"
        >
          湖南大学试卷库
        </Link>
      </div>

      {/* 中间导航菜单 - 仅桌面端显示 */ }
      <div className="hidden md:flex items-center space-x-1">
        { navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                { item.label }
              </Button>
            </Link>
          )
        }) }
      </div>

      {/* 右侧用户菜单 */ }
      <div className="flex items-center">
        <DropdownMenu>
          { isClient
            ? (
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-gray-100"
                  >
                    {/* 用户头像 */ }
                    <div
                      className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium"
                    >
                      { user.nickname.charAt(0).toUpperCase() }
                    </div>

                    {/* 宽屏幕下显示用户名 */ }
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      { user.nickname }
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              )
            : (
                <></>
              )}

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/user")}>
              <IconUser size={16} />
              个人中心
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              <IconLogout size={16} />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
