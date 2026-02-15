"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import DeleteModal from "@/src/app/(main)/member/[QQID]/components/delete"
import InfoSection from "@/src/app/(main)/member/[QQID]/components/info"
import PasswordModal from "@/src/app/(main)/member/[QQID]/components/password"
import { useAuth } from "@/src/contexts/auth"

export default function () {
  const { QQID } = useParams<{ QQID: string }>()
  const { isAdmin } = useAuth()

  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)
  const [isDeleteDisplayed, setIsDeleteDisplayed] = useState(false)

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4">
      <InfoSection QQID={QQID} />
      { isAdmin && (
        <Card>
          <CardFooter className="justify-end gap-4">
            <Button onClick={() => setIsPasswordDisplayed(true)}>
              重置密码
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDisplayed(true)}
            >
              删除用户
            </Button>
          </CardFooter>
          <PasswordModal
            QQID={QQID}
            isOpen={isPasswordDisplayed}
            onClose={() => setIsPasswordDisplayed(false)}
          />
          <DeleteModal
            QQID={QQID}
            isOpen={isDeleteDisplayed}
            onClose={() => setIsDeleteDisplayed(false)}
          />
        </Card>
      ) }
    </div>
  )
}
