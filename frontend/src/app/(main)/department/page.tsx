"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppData } from "@/src/stores/app"

export default function () {
  const { getAllDepartments } = useAppData()
  const departments = getAllDepartments()

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>部门列表</CardTitle>
        </CardHeader>
        <CardContent>
          {JSON.stringify(departments)}
        </CardContent>
      </Card>
    </div>
  )
}
