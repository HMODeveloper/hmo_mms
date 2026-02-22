"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import DeleteModal from "@/src/app/(main)/member/[QQID]/components/delete"
import InfoSection from "@/src/app/(main)/member/[QQID]/components/info"
import PasswordModal from "@/src/app/(main)/member/[QQID]/components/password"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  const { QQID } = useParams<{ QQID: string }>()
  const { user } = useAuth()
  const { getMember, getAllColleges } = useAppData()
  const member = getMember(QQID)
  const colleges = getAllColleges()
  useBread("成员管理", member?.nickname ?? QQID)

  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)
  const [isDeleteDisplayed, setIsDeleteDisplayed] = useState(false)

  return (
    <>
      <InfoSection member={member} colleges={colleges} />
      { user?.isAdmin && (
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
    </>
  )
}
