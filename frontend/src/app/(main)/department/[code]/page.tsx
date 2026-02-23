"use client"

import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import DeleteModal from "@/src/app/(main)/department/[code]/components/delete"
import EditModal from "@/src/app/(main)/department/[code]/components/edit"
import InfoSection from "@/src/app/(main)/department/[code]/components/info"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  const { code } = useParams<{ code: string }>()
  const { getDepartment, getAllMembers, updateDepartments, updateMembers } = useAppData()
  const { user } = useAuth()

  const department = useMemo(() => getDepartment(code), [getDepartment, code])
  const members = useMemo(() => getAllMembers(), [getAllMembers])

  useBread("部门管理", department?.name ?? code)

  const [isEditDisplayed, setIsEditDisplayed] = useState(false)
  const [isDeleteDisplayed, setIsDeleteDisplayed] = useState(false)

  if (!department) {
    return null
  }

  return (
    <>
      <InfoSection department={department} />
      {user?.isMinister(code) && (
        <Card>
          <CardFooter className="justify-end gap-4">
            <Button onClick={() => setIsEditDisplayed(true)}>
              编辑成员
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDisplayed(true)}
            >
              删除部门
            </Button>
          </CardFooter>
          <EditModal
            user={user}
            department={department}
            members={members}
            isOpen={isEditDisplayed}
            onClose={() => setIsEditDisplayed(false)}
            onChange={() =>
              Promise.all([updateDepartments(), updateMembers()]).then(() => {})}
          />
          {user?.isSuperAdmin && (
            <DeleteModal
              code={code}
              isOpen={isDeleteDisplayed}
              onClose={() => setIsDeleteDisplayed(false)}
              onChange={() =>
                Promise.all([updateDepartments(), updateMembers()]).then(() => {})}
            />
          )}
        </Card>
      )}
    </>
  )
}
