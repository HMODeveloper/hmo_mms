"use client"

import type { ElementType } from "react"
import { IconBuilding, IconCrown, IconUsers } from "@tabler/icons-react"
import { useMemo } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppData } from "@/src/stores/app"

function StatCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: ElementType
  title: string
  value: number | string
  description?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Icon />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export default function () {
  const { getAllMembers, getAllDepartments } = useAppData()

  const members = useMemo(() => getAllMembers(), [getAllMembers])
  const departments = useMemo(() => getAllDepartments(), [getAllDepartments])
  const admins = useMemo(() => members.filter(m => m.isAdmin).length, [members])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={IconUsers}
        title="总成员数"
        value={members.length}
        description="当前系统中的全部成员"
      />
      <StatCard
        icon={IconBuilding}
        title="部门数量"
        value={departments.length}
        description="当前系统中的全部部门"
      />
      <StatCard
        icon={IconCrown}
        title="管理员数量"
        value={admins}
        description="拥有管理权限的成员数"
      />
    </div>
  )
}
