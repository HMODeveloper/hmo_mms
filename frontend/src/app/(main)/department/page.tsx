"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import ListSection from "@/src/app/(main)/department/components/list"

export default function () {
  const router = useRouter()

  return (
    <>
      <ListSection />
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
