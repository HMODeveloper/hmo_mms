"use client"

import type { AddDepartmentRequest } from "@/src/schema/department"
import { IconUpload } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addDepartment } from "@/src/apis/department"
import { useBread } from "@/src/contexts/bread"
import { useAppData } from "@/src/stores/app"

export default function () {
  const { getAllMembers } = useAppData()
  const members = useMemo(() => getAllMembers(), [getAllMembers])
  useBread("部门管理", "添加部门")

  const [formData, setFormData] = useState<AddDepartmentRequest>({
    name: "",
    code: "",
    minister: [],
    member: [],
  })

  const handleCheckMinister = (QQID: string) => {
    const checked = formData.minister.includes(QQID)
    if (checked) {
      setFormData(v => ({
        ...v,
        minister: v.minister.filter(item => item !== QQID),
      }))
    }
    else {
      setFormData(v => ({
        ...v,
        minister: [...v.minister, QQID],
        member: [...v.member, QQID],
      }))
    }
  }

  const handleCheckMember = (QQID: string) => {
    const checked = formData.member.includes(QQID)
    if (checked) {
      setFormData(v => ({
        ...v,
        minister: v.minister.filter(item => item !== QQID),
        member: v.member.filter(item => item !== QQID),
      }))
    }
    else {
      setFormData(v => ({
        ...v,
        member: [...v.member, QQID],
      }))
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.code)
      return

    addDepartment(formData)
      .then(() => {
        toast.success("添加部门成功!")
      })
      .catch((error) => {
        switch (error.code) {
          case "SUPERADMIN_REQUIRED":
            toast.error("需要超级管理员权限.")
            break
          case "DEPT_CODE_EXISTS":
            toast.error("部门代码已存在.")
            break
          case "DEPT_NAME_EXISTS":
            toast.error("部门名称已存在.")
            break
          case "MINISTER_NOT_FOUND":
            toast.error("部长列表中有用户不存在.")
            break
          case "MEMBER_NOT_FOUND":
            toast.error("成员列表中有用户不存在.")
            break
          case "MINISTER_NOT_IN_MEMBERS":
            toast.error("部长必须同时是成员.")
            break
          default:
            toast.error("添加部门失败, 请稍后再试.")
        }
      })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>添加部门</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="w-full flex flex-col gap-4">
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>部门名称</FieldLabel>
                <Input
                  value={formData.name}
                  onInput={e =>
                    setFormData(v => ({
                      ...v,
                      name: (e.target as HTMLInputElement).value,
                    }))}
                />
              </Field>
              <Field>
                <FieldLabel>部门代码</FieldLabel>
                <Input
                  value={formData.code}
                  onInput={e =>
                    setFormData(v => ({
                      ...v,
                      code: (e.target as HTMLInputElement).value,
                    }))}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
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
                            checked={formData.member.includes(item.QQID)}
                            onCheckedChange={() => handleCheckMember(item.QQID)}
                          />
                          <FieldLabel htmlFor={`member-${item.QQID}`}>添加成员</FieldLabel>
                        </Field>
                      </TableCell>
                      <TableCell className="text-center">
                        <Field orientation="horizontal">
                          <Checkbox
                            id={`minister-${item.QQID}`}
                            checked={formData.minister.includes(item.QQID)}
                            onCheckedChange={() => handleCheckMinister(item.QQID)}
                          />
                          <FieldLabel htmlFor={`minister-${item.QQID}`}>设为部长</FieldLabel>
                        </Field>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <Button onClick={handleSubmit}>
            <IconUpload />
            提交
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
