<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui"

import type { LoginRequest } from "~/apis/auth"
import * as z from "zod"
import { getUserInfo, userLogin } from "~/apis/auth"

definePageMeta({
  layout: false,
})

const toast = useToast()
const { setUserInfo, clearUserInfo } = useAuth()

const fields: AuthFormField[] = [
  {
    name: "QQID",
    type: "number",
    label: "QQ 号",
    placeholder: "请输入 QQ 号",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "密码",
    placeholder: "请输入密码",
    required: true,
  },
]

const schema = z.object({
  QQID: z.number(" "),
  password: z.string(" "),
})

type Schema = z.output<typeof schema>

function handleSubmit(payload: FormSubmitEvent<Schema>) {
  const request: LoginRequest = {
    QQID: payload.data.QQID,
    password: payload.data.password,
  }

  userLogin(request)
    .then((_response) => {
      toast.add({
        title: "登录成功",
      })

      getUserInfo()
        .then((response) => {
          setUserInfo(response)

          navigateTo("/dashboard")
        })
        .catch((_error) => {
          toast.add({
            title: "获取用户信息失败",
            description: "发生未知错误，请稍后再试",
            color: "error",
          })
        })
    })
    .catch((error) => {
      switch (error.code) {
        case "USER_NOT_FOUND":
          toast.add({
            title: "用户不存在",
            description: "请检查 QQ 号是否正确",
            color: "error",
          })
          break
        case "INVALID_PASSWORD":
          toast.add({
            title: "密码错误",
            description: "请检查密码是否正确",
            color: "error",
          })
          break
        default:
          toast.add({
            title: "登录失败",
            description: "发生未知错误，请稍后再试",
            color: "error",
          })
      }

      clearUserInfo()
    })
}
</script>

<template>
  <UMain>
    <UPageHero
      orientation="horizontal"
    >
      <template #description>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aperiam asperiores doloremque ducimus exercitationem facere illo, nulla, pariatur perspiciatis placeat quas quia quis quo sapiente ut velit vero voluptate. Qui.
      </template>
      <UAuthForm
        :schema="schema"
        icon="i-tabler-user"
        :fields="fields"
        @submit="handleSubmit"
      />
    </UPageHero>
  </UMain>
</template>

<style scoped>

</style>
