"use client"

import dayjs from "dayjs"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DepartmentSection from "@/src/app/(main)/dashboard/components/department"
import MembersSection from "@/src/app/(main)/dashboard/components/members"
import StatsSection from "@/src/app/(main)/dashboard/components/stats"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"

export default function () {
  const { user } = useAuth()
  useBread("首页")

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{`你好, ${user?.nickname ?? "用户"} !`}</CardTitle>
          <CardDescription>
            欢迎使用湖南大学岳麓幻境社成员管理系统.
          </CardDescription>
          <CardDescription>
            今天是你加入
            {" "}
            <Badge>
              <Link href="https://www.hmomc.cn" target="_blank">岳麓幻境社</Link>
            </Badge>
            {" "}
            的第
            {dayjs().diff(dayjs(user?.createAt), "day")}
            天
          </CardDescription>
        </CardHeader>
      </Card>
      <StatsSection />
      <MembersSection />
      <DepartmentSection />
    </>
  )
}
