"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDepartment } from "@/src/stores/department"

export default function () {
  const { departments } = useDepartment()

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
