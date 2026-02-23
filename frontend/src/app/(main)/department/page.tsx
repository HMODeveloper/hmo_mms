"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import ListSection from "@/src/app/(main)/department/components/list"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  const router = useRouter()
  const { getAllDepartments } = useAppData()
  const departments = useMemo(() => getAllDepartments(), [getAllDepartments])
  useBread("部门管理")

  return (
    <>
      <ListSection departments={departments} />
      <Card>
        <CardFooter className="justify-end gap-4">
          <Button
            onClick={() => router.push("/department/add")}
          >
            添加部门
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
