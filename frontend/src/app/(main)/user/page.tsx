"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import DeleteModal from "@/src/app/(main)/user/components/delete"
import InfoSection from "@/src/app/(main)/user/components/info"
import PasswordModal from "@/src/app/(main)/user/components/password"

export default function () {
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)
  const [isDeleteDisplayed, setIsDeleteDisplayed] = useState(false)

  return (
    <>
      <InfoSection />
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
        />
        <DeleteModal
          isOpen={isDeleteDisplayed}
          onClose={() => setIsDeleteDisplayed(false)}
        />
      </Card>
    </>
  )
}
