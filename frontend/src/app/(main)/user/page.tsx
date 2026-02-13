"use client"

import { IconCheckbox, IconEdit } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/src/contexts/auth"

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
  const { user } = useAuth()

  // 是否为编辑模式
  const [isEditing, setIsEditing] = useState(false)
  // 是否有改动
  const [isEdited, setIsEdited] = useState(false)

  const [formData, setFormData] = useState<FormSchema>({
    nickname: user?.nickname || "",
    mcName: user?.mcName || "",
    realName: user?.realName || "",
    studentID: user?.studentID || "",
    college: user?.college || "",
    school: user?.school || "",
    major: user?.major || "",
    grade: user?.grade || undefined,
    classIndex: user?.classIndex || undefined,
  })

  const formatMajorClass = useMemo(() => {
    const yy = formData.grade?.toString().slice(-2)
    const index = formData.classIndex?.toString().padStart(2, "0")
    if (yy && index && formData.major)
      return `${formData.major}${yy}${index}`
    return "---"
  }, [formData.major, formData.grade, formData.classIndex])

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
    setFormData({
      nickname: user?.nickname || "",
      mcName: user?.mcName || "",
      realName: user?.realName || "",
      studentID: user?.studentID || "",
      college: user?.college || "",
      school: user?.school || "",
      major: user?.major || "",
      grade: user?.grade || undefined,
      classIndex: user?.classIndex || undefined,
    })

    setIsEdited(false)
  }

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(v => !v)}
              className="font-semibold"
            >
              { isEditing ? <IconCheckbox /> : <IconEdit /> }
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="w-full flex flex-col gap-4">
            <FieldGroup className="grid grid-cols-4">
              <Field>
                <FieldLabel>QQ 号</FieldLabel>
                <Input
                  value={user?.QQID}
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
                  onInput={() => {}}
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
              <Field>
                <FieldLabel>学院</FieldLabel>
                <Input
                  value={formData.college}
                  onInput={() => {}}
                />
              </Field>

              {/* 学校字段: 仅外校学生显示 */}
              {formData.college === "NOT_HNU" && (
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
              )}

              {/* 专业班级字段: 仅本校学生显示, 显示时合并, 编辑时分开 */}
              {formData.college !== "NOT_HNU" && (
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
                          onInput={() => {}}
                        />
                      </Field>
                    )
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-4">
          {isEdited && <Button variant="outline" onClick={handleReset}>重置</Button> }
          <Button>更新</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
