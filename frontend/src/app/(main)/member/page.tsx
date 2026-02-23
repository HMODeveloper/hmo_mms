"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import AddModal from "@/src/app/(main)/member/components/add"
import ListSection from "@/src/app/(main)/member/components/list"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  const { user } = useAuth()
  const { getAllMembers, getAllColleges } = useAppData()
  useBread("成员管理")

  const members = useMemo(() => getAllMembers(), [getAllMembers])
  const colleges = useMemo(() => getAllColleges(), [getAllColleges])

  const [isAddModalDisplay, setIsAddModalDisplay] = useState(false)

  return (
    <>
      <ListSection members={members} />
      {user?.isAdmin && (
        <Card>
          <CardFooter className="justify-end gap-4">
            <Button
              onClick={() => setIsAddModalDisplay(true)}
            >
              添加成员
            </Button>
          </CardFooter>
        </Card>
      )}
      <AddModal
        colleges={colleges}
        isOpen={isAddModalDisplay}
        onClose={() => setIsAddModalDisplay(false)}
      />
    </>
  )
}
