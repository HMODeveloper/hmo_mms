"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import DeleteModal from "@/src/app/(main)/user/components/delete"
import InfoSection from "@/src/app/(main)/user/components/info"
import PasswordModal from "@/src/app/(main)/user/components/password"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  useBread("个人中心")
  const { user, update, logout } = useAuth()
  const { getAllColleges, getCollege, getDepartment } = useAppData()
  const colleges = useMemo(() => getAllColleges(), [getAllColleges])
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)
  const [isDeleteDisplayed, setIsDeleteDisplayed] = useState(false)

  const updateUser = async () => {
    await update(getCollege, getDepartment)
  }

  return (
    <>
      <InfoSection
        colleges={colleges}
        user={user}
        update={updateUser}
      />
      <Card>
        <CardFooter className="justify-end gap-4">
          <Button onClick={() => setIsPasswordDisplayed(true)}>
            修改密码
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDisplayed(true)}
          >
            用户注销
          </Button>
        </CardFooter>
        <PasswordModal
          isOpen={isPasswordDisplayed}
          onClose={() => setIsPasswordDisplayed(false)}
          logout={logout}
        />
        <DeleteModal
          isOpen={isDeleteDisplayed}
          onClose={() => setIsDeleteDisplayed(false)}
        />
      </Card>
    </>
  )
}
