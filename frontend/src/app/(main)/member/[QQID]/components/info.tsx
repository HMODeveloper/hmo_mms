"use client"

import type { UpdateUserInfoRequest } from "@/src/types/request"
import { IconArrowLeft, IconEdit, IconRefresh, IconUpload } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateInfo } from "@/src/apis/member"
import { useAuth } from "@/src/contexts/auth"
import { useColleges } from "@/src/stores/colleges"
import { useMembers } from "@/src/stores/members"
import { createUserFormatter } from "@/src/utils/info"

export default function InfoSection({
  QQID,
}: {
  QQID: string
}) {
  const { isAdmin } = useAuth()
  const { members, refreshMembers } = useMembers()
  const member = members.find(item => item.QQID === QQID)
  const { colleges } = useColleges()
  const { formatCreateAt, formatDepartment, formatMajorClass, getCollegeName, formatLevel } = createUserFormatter()

  // 是否为编辑模式
  const [isEditing, setIsEditing] = useState(false)
  // 是否有改动
  const [isEdited, setIsEdited] = useState(false)

  // 初始化表单数据函数
  const initFormData = (memberData = member): UpdateUserInfoRequest => ({
    nickname: memberData?.nickname || "",
    mcName: memberData?.mcName || "",
    realName: memberData?.realName || "",
    studentID: memberData?.studentID || "",
    college: memberData?.college || "",
    school: memberData?.school || "",
    major: memberData?.major || "",
    grade: memberData?.grade || undefined,
    classIndex: memberData?.classIndex || undefined,
  })

  const [formData, setFormData] = useState<UpdateUserInfoRequest>(initFormData)

  useEffect(() => {
    if (member && !isEditing) {
      setFormData(initFormData())
      setIsEdited(false)
    }
  }, [member, isEditing])

  const handleInput = (updater: (v: UpdateUserInfoRequest) => Partial<UpdateUserInfoRequest>) => {
    if (!isEditing)
      return

    setIsEdited(true)
    setFormData(v => ({
      ...v,
      ...updater(v),
    }))
  }

  const handleReset = () => {
    setFormData(initFormData())
    setIsEdited(false)
  }

  const handleUpdate = () => {
    if (!isEdited)
      return

    updateInfo(QQID, formData)
      .then(() => {
        toast.success("修改信息成功!")
        void refreshMembers()
        handleReset()
        setIsEditing(false)
      })
      .catch(() => {
        toast.error("修改信息失败，请稍后再试")
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="w-full flex flex-col gap-4">
          <FieldGroup className="grid grid-cols-4">
            <Field>
              <FieldLabel>QQ 号</FieldLabel>
              <Input
                value={member?.QQID ?? ""}
                onInput={() => {}}
              />
            </Field>
            <Field>
              <FieldLabel>用户名</FieldLabel>
              <Input
                value={formData.nickname}
                onInput={e =>
                  handleInput(v => ({
                    ...v,
                    nickname: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>
            <Field>
              <FieldLabel>游戏 ID</FieldLabel>
              <Input
                value={formData.mcName ?? ""}
                onInput={e =>
                  handleInput(v => ({
                    ...v,
                    mcName: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>
            <Field>
              <FieldLabel>注册时间</FieldLabel>
              <Input
                value={formatCreateAt(member?.createAt)}
                onInput={() => {}}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-4">
            <Field>
              <FieldLabel>姓名</FieldLabel>
              <Input
                value={formData.realName ?? ""}
                onInput={e =>
                  handleInput(v => ({
                    ...v,
                    realName: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>
            <Field>
              <FieldLabel>学号</FieldLabel>
              <Input
                value={formData.studentID ?? ""}
                onInput={e =>
                  handleInput(v => ({
                    ...v,
                    studentID: (e.target as HTMLInputElement).value,
                  }))}
              />
            </Field>

            {/* 学院字段: 编辑时显示 selector */ }
            { isEditing
              ? (
                  <Field>
                    <FieldLabel>学院</FieldLabel>
                    <Select
                      value={formData.college}
                      onValueChange={value =>
                        handleInput(v => ({
                          ...v,
                          college: value,
                        }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          { colleges.map(item => (
                            <SelectItem value={item.code} key={item.code}>
                              { item.name }
                            </SelectItem>
                          )) }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )
              : (
                  <Field>
                    <FieldLabel>学院</FieldLabel>
                    <Input
                      value={getCollegeName(formData.college)}
                      onInput={() => {}}
                    />
                  </Field>
                ) }

            {/* 学校字段: 仅外校学生显示 */ }
            { formData.college === "NOT_HNU" && (
              <Field>
                <FieldLabel>学校</FieldLabel>
                <Input
                  value={formData.school ?? ""}
                  onInput={e =>
                    handleInput(v => ({
                      ...v,
                      school: (e.target as HTMLInputElement).value,
                    }))}
                />
              </Field>
            ) }

            {/* 专业班级字段: 仅本校学生显示, 显示时合并, 编辑时分开 */ }
            { formData.college !== "NOT_HNU" && (
              isEditing
                ? (
                    <>
                      <Field>
                        <FieldLabel>专业</FieldLabel>
                        <Input
                          value={formData.major ?? ""}
                          onInput={e =>
                            handleInput(v => ({
                              ...v,
                              major: (e.target as HTMLInputElement).value,
                            }))}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>年级</FieldLabel>
                        <Input
                          value={formData.grade ?? ""}
                          type="number"
                          onInput={e =>
                            handleInput(v => ({
                              ...v,
                              grade: Number((e.target as HTMLInputElement).value),
                            }))}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>班级序号</FieldLabel>
                        <Input
                          value={formData.classIndex ?? ""}
                          type="number"
                          onInput={e =>
                            handleInput(v => ({
                              ...v,
                              classIndex: Number((e.target as HTMLInputElement).value),
                            }))}
                        />
                      </Field>
                    </>
                  )
                : (
                    <Field>
                      <FieldLabel>专业班级</FieldLabel>
                      <Input
                        value={formatMajorClass(formData.grade, formData.classIndex, formData.major)}
                        onInput={() => {}}
                      />
                    </Field>
                  )
            ) }
          </FieldGroup>
          <FieldGroup className="grid grid-cols-4">
            <Field>
              <FieldLabel>部门</FieldLabel>
              <Input
                value={formatDepartment(member?.departments)}
                onInput={() => {}}
              />
            </Field>
            <Field>
              <FieldLabel>权限级别</FieldLabel>
              <Input
                value={formatLevel(member?.level)}
                onInput={() => {}}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      { isAdmin && (
        <CardFooter className="justify-end gap-4">
          { isEditing
            ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      handleReset()
                    }}
                  >
                    <IconArrowLeft />
                    取消
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <IconRefresh />
                    重置
                  </Button>
                  <Button onClick={handleUpdate}>
                    <IconUpload />
                    更新
                  </Button>
                </>
              )
            : (
                <Button onClick={() => setIsEditing(true)}>
                  <IconEdit />
                  编辑
                </Button>
              ) }
        </CardFooter>
      ) }
    </Card>
  )
}
