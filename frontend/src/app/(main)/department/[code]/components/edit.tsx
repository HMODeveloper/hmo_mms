import type { Department } from "@/src/models/department"
import type { User } from "@/src/models/user"
import { IconUpload } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  addDepartmentMember,
  addDepartmentMinister,
  removeDepartmentMember,
  removeDepartmentMinister,
} from "@/src/apis/department"

export default function ({
  user,
  department,
  members,
  isOpen,
  onClose,
  onChange,
}: {
  user: User
  department: Department
  members: User[]
  isOpen: boolean
  onClose: () => void
  onChange: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = () => {
    onChange().then(() => setIsLoading(false))
  }

  const handleCheckMember = (QQID: string) => {
    const checked = department.member.map(item => item.QQID).includes(QQID)

    if (checked) {
      setIsLoading(true)
      removeDepartmentMember(department.code, QQID)
        .then(() => {
          toast.success("成员已移除.")
        })
        .catch((error) => {
          switch (error.code) {
            case "DEPT_NOT_FOUND":
              toast.error("部门不存在.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_NOT_IN_DEPT":
              toast.error("用户不在部门中.")
              break
            case "SUPERADMIN_REQUIRED":
              toast.error("移除部长需要超级管理员权限.")
              break
            case "MINISTER_REQUIRED":
              toast.error("需要部长权限.")
              break
            default:
              toast.error("移除失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
    else {
      addDepartmentMember(department.code, QQID)
        .then(() => {
          toast.success("成员已添加.")
        })
        .catch((error) => {
          switch (error.code) {
            case "DEPT_NOT_FOUND":
              toast.error("部门不存在.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_ALREADY_IN_DEPT":
              toast.error("用户已在部门中.")
              break
            case "MINISTER_REQUIRED":
              toast.error("需要部长权限.")
              break
            default:
              toast.error("添加失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
  }

  const handleCheckMinister = (QQID: string) => {
    const checked = department.minister.map(item => item.QQID).includes(QQID)

    if (checked) {
      setIsLoading(true)
      removeDepartmentMinister(department.code, QQID)
        .then(() => {
          toast.success("部长已移除.")
        })
        .catch((error) => {
          switch (error.code) {
            case "DEPT_NOT_FOUND":
              toast.error("部门不存在.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_NOT_IN_DEPT":
              toast.error("用户不在部门中.")
              break
            case "USER_NOT_MINISTER":
              toast.error("用户不是部长.")
              break
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            default:
              toast.error("移除失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
    else {
      setIsLoading(true)
      addDepartmentMinister(department.code, QQID)
        .then(() => {
          toast.success("部长已添加.")
        })
        .catch((error) => {
          switch (error.code) {
            case "DEPT_NOT_FOUND":
              toast.error("部门不存在.")
              break
            case "USER_NOT_FOUND":
              toast.error("用户不存在.")
              break
            case "USER_NOT_IN_DEPT":
              toast.error("用户不在部门中.")
              break
            case "USER_ALREADY_MINISTER":
              toast.error("用户已是部长.")
              break
            case "SUPERADMIN_REQUIRED":
              toast.error("需要超级管理员权限.")
              break
            default:
              toast.error("添加失败, 请稍后再试.")
          }
        })
        .finally(handleUpdate)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false} className="min-w-6xl">
        <DialogHeader>
          <DialogTitle>编辑成员</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">序号</TableHead>
              <TableHead className="text-center">昵称</TableHead>
              <TableHead className="text-center">游戏 ID</TableHead>
              <TableHead className="text-center">QQ 号</TableHead>
              <TableHead className="text-center">部门</TableHead>
              <TableHead className="text-center" colSpan={2}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((item, index) => (
              <TableRow key={item.QQID}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.nickname}</TableCell>
                <TableCell className="text-center">{item.mcName ?? "无"}</TableCell>
                <TableCell className="text-center">{item.QQID}</TableCell>
                <TableCell className="text-center">
                  {item.departments.length > 0
                    ? item.departments.map(item => (
                        <Badge key={item.code} variant="secondary">{item.name}</Badge>
                      ))
                    : <Badge variant="secondary">无</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`member-${item.QQID}`}
                      checked={department.member.map(i => i.QQID).includes(item.QQID)}
                      onCheckedChange={() => handleCheckMember(item.QQID)}
                      disabled={isLoading && !user.isMinister(department.code || "")}
                    />
                    <FieldLabel htmlFor={`member-${item.QQID}`}>添加成员</FieldLabel>
                  </Field>
                </TableCell>
                <TableCell className="text-center">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`minister-${item.QQID}`}
                      checked={department.minister.map(i => i.QQID).includes(item.QQID)}
                      onCheckedChange={() => handleCheckMinister(item.QQID)}
                      disabled={isLoading && !user.isSuperAdmin}
                    />
                    <FieldLabel htmlFor={`minister-${item.QQID}`}>设为部长</FieldLabel>
                  </Field>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="justify-end gap-4">
          <Button onClick={onClose}>
            <IconUpload />
            完成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
