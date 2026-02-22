"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import AddModal from "@/src/app/(main)/member/components/add"
import ListSection from "@/src/app/(main)/member/components/list"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"

export default function () {
  const { user } = useAuth()
  useBread("成员管理")
  const [isAddModalDisplay, setIsAddModalDisplay] = useState(false)

  return (
    <>
      <ListSection />
      { user?.isAdmin && (
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
        isOpen={isAddModalDisplay}
        onClose={() => setIsAddModalDisplay(false)}
      />
    </>
  )
}
