"use client"

import type { BaseCollegeInfo } from "@/src/schema/common"
import type { AddMemberRequest } from "@/src/schema/member"
import { IconArrowLeft, IconEye, IconEyeOff, IconRefresh, IconUpload } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getCollegesInfo } from "@/src/apis/public"
import { checkQQ, signUp } from "@/src/apis/signup"

export default function () {
  const router = useRouter()
  const [colleges, setColleges] = useState<BaseCollegeInfo[]>([])

  useEffect(() => {
    getCollegesInfo().then(setColleges).catch(() => {})
  }, [])

  const [isChecked, setIsChecked] = useState(false)
  const [QQID, setQQID] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<AddMemberRequest>({
    QQID: "",
    nickname: "",
    password: "",
    realName: "",
    college: "OTHERS",
  })

  useEffect(() => {
    setFormData((prev: AddMemberRequest) => ({ ...prev, QQID }))
  }, [QQID])

  const handleCheckQQ = () => {
    if (isChecked) {
      setIsChecked(false)
      setQQID("")
      return
    }

    if (!QQID)
      return
    checkQQ(QQID)
      .then(() => setIsChecked(true))
      .catch((error) => {
        switch (error.code) {
          case "QQID_ALREADY_EXISTS":
            toast.warning("该 QQ 号已存在")
            break
          default:
            toast.error("检查 QQ 号失败")
        }
      })
  }

  const handleSubmit = () => {
    if (!isChecked)
      return

    signUp(formData)
      .then(() => {
        toast.success("注册成功")
        handleCheckQQ()
        router.push("/")
      })
      .catch(() => {
        toast.error("添加失败")
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 lg:px-16">
      <Dialog open={true}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>新用户注册</DialogTitle>
          </DialogHeader>
          <form className="w-full flex flex-col gap-4 no-scrollbar max-h-[75vh] overflow-y-auto">
            <FieldGroup>
              <Field>
                <FieldLabel>QQ号</FieldLabel>
                <Field orientation="horizontal">
                  <Input
                    value={QQID ?? ""}
                    onInput={e =>
                      setQQID((e.target as HTMLInputElement).value)}
                    placeholder="请输入 QQ 号"
                    disabled={isChecked}
                  />
                  <Button
                    variant={isChecked ? "default" : "outline"}
                    onClick={(e) => {
                      e.preventDefault()
                      handleCheckQQ()
                    }}
                  >
                    {isChecked ? <IconRefresh /> : <IconUpload />}
                    {isChecked ? "重置" : "检查" }
                  </Button>
                </Field>
              </Field>
            </FieldGroup>

            {/* 实际表单, QQ号检测成功后显示 */}
            {isChecked && (
              <>
                <Separator />
                <FieldGroup className="grid grid-cols-2">
                  <Field>
                    <FieldLabel>昵称</FieldLabel>
                    <Input
                      value={formData.nickname ?? ""}
                      onInput={e =>
                        setFormData((v: AddMemberRequest) => ({
                          ...v,
                          nickname: (e.target as HTMLInputElement).value,
                        }))}
                      placeholder="请输入昵称"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>游戏 ID</FieldLabel>
                    <Input
                      value={formData.mcName ?? ""}
                      onInput={e =>
                        setFormData((v: AddMemberRequest) => ({
                          ...v,
                          mcName: (e.target as HTMLInputElement).value,
                        }))}
                      placeholder="请输入昵称"
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup className="grid">
                  <Field>
                    <FieldLabel>密码</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password ?? ""}
                        onInput={e =>
                          setFormData((v: AddMemberRequest) => ({
                            ...v,
                            password: (e.target as HTMLInputElement).value,
                          }))}
                        placeholder="请输入密码"
                      />
                      <Button
                        className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        variant="ghost"
                      >
                        {showPassword ? <IconEye /> : <IconEyeOff />}
                      </Button>
                    </div>
                  </Field>
                </FieldGroup>
                <FieldGroup className="grid grid-cols-2">
                  <Field>
                    <FieldLabel>姓名</FieldLabel>
                    <Input
                      value={formData.realName ?? ""}
                      onInput={e =>
                        setFormData((v: AddMemberRequest) => ({
                          ...v,
                          realName: (e.target as HTMLInputElement).value,
                        }))}
                      placeholder="请输入真实姓名"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>学号</FieldLabel>
                    <Input
                      value={formData.studentID ?? ""}
                      onInput={e =>
                        setFormData((v: AddMemberRequest) => ({
                          ...v,
                          studentID: (e.target as HTMLInputElement).value,
                        }))}
                      placeholder="请输入学号"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>学院</FieldLabel>
                    <Select
                      value={formData.college}
                      onValueChange={value =>
                        setFormData((v: AddMemberRequest) => ({
                          ...v,
                          college: value,
                        }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择学院" />
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

                  {formData.college === "NOT_HNU"
                    ? (
                      //  学校: 仅外校学生显示
                        <Field>
                          <FieldLabel>学校</FieldLabel>
                          <Input
                            value={formData.school ?? ""}
                            onInput={e =>
                              setFormData((v: AddMemberRequest) => ({
                                ...v,
                                school: (e.target as HTMLInputElement).value,
                              }))}
                            placeholder="请输入学校"
                          />
                        </Field>
                      )
                    : (
                      // 专业班级: 仅本校学生显示
                        <>
                          <Field>
                            <FieldLabel>专业</FieldLabel>
                            <Input
                              value={formData.major ?? ""}
                              onInput={e =>
                                setFormData((v: AddMemberRequest) => ({
                                  ...v,
                                  major: (e.target as HTMLInputElement).value,
                                }))}
                              placeholder="请输入专业"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>年级</FieldLabel>
                            <Input
                              value={formData.grade ?? ""}
                              type="number"
                              onInput={e =>
                                setFormData((v: AddMemberRequest) => ({
                                  ...v,
                                  grade: Number((e.target as HTMLInputElement).value),
                                }))}
                              placeholder="请输入年级"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>班级序号</FieldLabel>
                            <Input
                              value={formData.classIndex ?? ""}
                              type="number"
                              onInput={e =>
                                setFormData((v: AddMemberRequest) => ({
                                  ...v,
                                  classIndex: Number((e.target as HTMLInputElement).value),
                                }))}
                              placeholder="请输入班级序号"
                            />
                          </Field>
                        </>
                      )}
                </FieldGroup>
              </>
            )}
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                router.push("/")
              }}
            >
              <IconArrowLeft />
              返回
            </Button>
            {isChecked && (
              <Button
                onClick={handleSubmit}
              >
                <IconUpload />
                注册
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
