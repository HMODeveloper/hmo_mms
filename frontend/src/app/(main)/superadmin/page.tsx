"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addAdmin, addSuperAdmin, removeAdmin, removeSuperAdmin } from "@/src/apis/superadmin"
import { useAuth } from "@/src/contexts/auth"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  useBread("超管功能")

  const { user } = useAuth()
  const { getAllMembers, updateMembers } = useAppData()
  const members = useMemo(() => (
    Array.from(getAllMembers()).sort((a, b) => a.nickname.localeCompare(b.nickname))
  ), [getAllMembers])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = () => {
    updateMembers().then(() => setIsLoading(false))
  }

  const handleCheckAdmin = (QQID: string, checked: boolean) => {
    setIsLoading(true)
    if (checked) {
      removeAdmin(QQID)
        .then(() => {
          toast.success("管理员已移除.")
        })
        .catch((error) => {
          switch (error.code) {
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_NOT_ADMIN":
              toast.error("用户不是管理员.")
              break
            default:
              toast.error("移除失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
    else {
      addAdmin(QQID)
        .then(() => {
          toast.success("管理员已添加.")
        })
        .catch((error) => {
          switch (error.code) {
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_ALREADY_ADMIN":
              toast.error("用户已是管理员.")
              break
            default:
              toast.error("添加失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
  }

  const handleCheckSuperAdmin = (QQID: string, checked: boolean) => {
    setIsLoading(true)
    if (checked) {
      removeSuperAdmin(QQID)
        .then(() => {
          toast.success("超级管理员已移除.")
        })
        .catch((error) => {
          switch (error.code) {
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_NOT_SUPERADMIN":
              toast.error("用户不是超级管理员.")
              break
            case "LAST_SUPERADMIN":
              toast.error("无法移除最后一个超级管理员.")
              break
            default:
              toast.error("移除失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
    else {
      addSuperAdmin(QQID)
        .then(() => {
          toast.success("超级管理员已添加.")
        })
        .catch((error) => {
          switch (error.code) {
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_ALREADY_SUPERADMIN":
              toast.error("用户已是超级管理员.")
              break
            default:
              toast.error("添加失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
  }

  if (!user?.isSuperAdmin) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>超管功能</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">你没有权限访问此页面.</p>
          </CardContent>
        </Card>
      </>
    )
  }

  if (!members)
    return null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>超管功能</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">序号</TableHead>
                <TableHead className="text-center">昵称</TableHead>
                <TableHead className="text-center">游戏 ID</TableHead>
                <TableHead className="text-center">QQ 号</TableHead>
                <TableHead className="text-center">用户级别</TableHead>
                <TableHead className="text-center" colSpan={2}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((item, index) => (
                <TableRow key={item.QQID}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.nickname}</TableCell>
                  <TableCell className="text-center">{item.mcName || "无"}</TableCell>
                  <TableCell className="text-center">{item.QQID}</TableCell>
                  <TableCell className="text-center">
                    {item.isSuperAdmin
                      ? <Badge variant="destructive">超级管理员</Badge>
                      : item.isAdmin
                        ? <Badge variant="default">管理员</Badge>
                        : <Badge variant="outline">成员</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Field orientation="horizontal">
                      <Checkbox
                        id={`superadmin-${item.QQID}`}
                        checked={item.isSuperAdmin}
                        onCheckedChange={() => handleCheckSuperAdmin(item.QQID, item.isSuperAdmin)}
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor={`superadmin-${item.QQID}`}>超级管理员</FieldLabel>
                    </Field>
                  </TableCell>
                  <TableCell className="text-center">
                    <Field orientation="horizontal">
                      <Checkbox
                        id={`admin-${item.QQID}`}
                        checked={item.isPureAdmin}
                        onCheckedChange={() => handleCheckAdmin(item.QQID, item.isPureAdmin)}
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor={`admin-${item.QQID}`}>管理员</FieldLabel>
                    </Field>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
