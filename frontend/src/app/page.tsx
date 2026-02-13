"use client"

import type { LoginRequest } from "@/src/apis/auth"
import { IconLoader, IconLogin2 } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getUserInfo, userLogin } from "@/src/apis/auth"
import { useAuth } from "@/src/contexts/auth"

function LoginForm() {
  const { setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [{ QQID, password }, setForm] = useState({ QQID: "", password: "" })

  const router = useRouter()

  const handleLogin = () => {
    if (!QQID || !password) {
      toast.error("请填写 QQ 号和密码")
      return
    }

    setIsLoading(true)

    const request: LoginRequest = {
      QQID: Number(QQID),
      password,
    }
    userLogin(request)
      .then(async () => {
        await getUserInfo()
          .then((response) => {
            setUser(response)
            toast.success("登录成功")

            void router.push("/dashboard")
          })
          .catch(() => null)
      })
      .catch((error) => {
        switch (error.code) {
          case "USER_NOT_FOUND":
            toast.warning("用户不存在")
            break
          case "INVALID_PASSWORD":
            toast.warning("密码错误")
            break
          default:
            toast.warning("登录失败")
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form className="w-full max-w-96 h-auto lg:h-144 p-6 lg:p-8 rounded-lg shadow-md flex items-center justify-center">
      <FieldGroup className="w-full">
        <Field>
          <FieldLabel htmlFor="qq_id">QQ 号</FieldLabel>
          <Input
            id="qq_id"
            type="number"
            value={QQID}
            onInput={e =>
              setForm(v => ({
                ...v,
                QQID: (e.target as HTMLInputElement).value,
              }))}
            placeholder="请输入 QQ 号"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">密码</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onInput={e =>
              setForm(v => ({
                ...v,
                password: (e.target as HTMLInputElement).value,
              }))}
            placeholder="请输入密码"
          />
        </Field>
        <Field>
          <Button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading
              ? <IconLoader className="animate-spin" />
              : <IconLogin2 />}
            登录
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default function IndexPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 lg:px-16">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-8 lg:gap-12">
        <div className="flex-1 max-w-2xl flex flex-col gap-6 lg:gap-8 text-center lg:text-left">
          <span className="text-3xl lg:text-4xl xl:text-5xl font-bold">岳麓幻境社成员管理系统</span>
          <span className="text-base lg:text-xl xl:text-2xl text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias architecto consequatur cupiditate dolorem doloribus ducimus eligendi esse exercitationem explicabo ipsam libero maxime nisi nostrum, nulla odit quas quia ratione rem!</span>
        </div>
        <div className="w-full lg:w-96 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
