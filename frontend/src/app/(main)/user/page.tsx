"use client"

import type { UpdateUserInfoRequest } from "@/src/types/request"
import { IconArrowLeft, IconEdit, IconRefresh, IconUpload } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateInfo } from "@/src/apis/user"
import { useAuth } from "@/src/contexts/auth"
import { USER_LEVEL_MAP } from "@/src/models/user"
import { useColleges } from "@/src/stores/colleges"

interface FormSchema {
  nickname: string
  mcName?: string
  realName?: string
  studentID?: string
  college: string
  school?: string
  major?: string
  grade?: number
  classIndex?: number
}

export default function () {
  const { user, refreshUser } = useAuth()
  const { colleges } = useColleges()

  // 是否为编辑模式
  const [isEditing, setIsEditing] = useState(false)
  // 是否有改动
  const [isEdited, setIsEdited] = useState(false)

  // 初始化表单数据函数
  const initFormData = (userData = user): FormSchema => ({
    nickname: userData?.nickname || "",
    mcName: userData?.mcName || "",
    realName: userData?.realName || "",
    studentID: userData?.studentID || "",
    college: userData?.college || "",
    school: userData?.school || "",
    major: userData?.major || "",
    grade: userData?.grade || undefined,
    classIndex: userData?.classIndex || undefined,
  })

  const [formData, setFormData] = useState<FormSchema>(initFormData)

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(initFormData())
      setIsEdited(false)
    }
  }, [user, isEditing])

  // 格式化专业班级显示: "专业2401"
  const formatMajorClass = useMemo(() => {
    const yy = formData.grade?.toString().slice(-2)
    const index = formData.classIndex?.toString().padStart(2, "0")
    if (yy && index && formData.major)
      return `${formData.major}${yy}${index}`
    return "---"
  }, [formData.major, formData.grade, formData.classIndex])

  // 学院名称
  const collegeName = useMemo(() => (
    colleges.find(item => item.code === formData.college)?.name || "---"
  ), [formData.college, colleges])

  // 格式化部门显示
  const formatDepartment = useMemo(() => (
    user?.departments.map(item => item.name).join(", ") || "无"
  ), [user?.departments])

  const handleInput = (updater: (v: FormSchema) => Partial<FormSchema>) => {
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

    const request: UpdateUserInfoRequest = {
      nickname: formData.nickname,
      mcName: formData.mcName,
      realName: formData.realName,
      studentID: formData.studentID,
      college: formData.college,
      school: formData.school,
      major: formData.major,
      grade: formData.grade,
      classIndex: formData.classIndex,
    }

    updateInfo(request)
      .then(() => {
        toast.success("修改信息成功!")
        refreshUser()
        handleReset()
        setIsEditing(false)
      })
      .catch(() => {
        toast.error("修改信息失败，请稍后再试")
      })
  }

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="w-full flex flex-col gap-4">
            <FieldGroup className="grid grid-cols-4">
              <Field>
                <FieldLabel>QQ 号</FieldLabel>
                <Input
                  value={user?.QQID}
                  onInput={() => {
                  }}
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
                  value={formData.mcName}
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
                  value={dayjs(user?.createAt).format("YYYY-MM-DD")}
                  onInput={() => {
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-4">
              <Field>
                <FieldLabel>姓名</FieldLabel>
                <Input
                  value={formData.realName}
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
                  value={formData.studentID}
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
                        value={collegeName}
                        onInput={() => {
                        }}
                      />
                    </Field>
                  ) }

              {/* 学校字段: 仅外校学生显示 */ }
              { formData.college === "NOT_HNU" && (
                <Field>
                  <FieldLabel>学校</FieldLabel>
                  <Input
                    value={formData.school}
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
                            value={formData.major}
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
                          value={formatMajorClass}
                          onInput={() => {
                          }}
                        />
                      </Field>
                    )
              ) }
            </FieldGroup>
            <FieldGroup className="grid grid-cols-4">
              <Field>
                <FieldLabel>部门</FieldLabel>
                <Input
                  value={formatDepartment}
                  onInput={() => {
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>权限级别</FieldLabel>
                <Input
                  value={user?.level ? USER_LEVEL_MAP[user.level] : "---"}
                  onInput={() => {
                  }}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
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
      </Card>
    </div>
  )
}
