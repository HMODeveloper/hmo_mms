<script setup lang="ts">
import * as z from "zod"
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui"

import type { LoginRequest } from "~/apis/auth"
import { loginAPI } from "~/apis/auth"
import { useUserStore } from "~/stores/user"

definePageMeta({
  layout: false,
})

const passwordHint = ref<string>("")
const attemptCount = ref<number>(0)
const userStore = useUserStore()

const fields = ref<AuthFormField[]>([
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
])

const schema = z.object({
  QQID: z.number(),
  password: z.string(),
})

type Schema = z.output<typeof schema>

const handleSubmit = async (payload: FormSubmitEvent<Schema>) => {
  const loginRequest: LoginRequest = {
    QQID: payload.data.QQID,
    password: payload.data.password,
  }

  loginAPI(loginRequest)
    .then((response) => {
      userStore.setUserInfo({
        nickname: response.data.nickname,
      })
      navigateTo("/dashboard")
    })
    .catch((error) => {
      if (error.status === 404) {
        passwordHint.value = "该 QQ 号不存在, 请先注册."
      }

      if (error.status === 403) {
        attemptCount.value++
        passwordHint.value = attemptCount.value < 5
          ? "密码错误, 请重试"
          : "忘记密码可联系管理员找回密码"
      }
    })
}
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="登录"
        :fields="fields"
        :schema="schema"
        :submit="{
          label: '登录',
          color: 'primary',
        }"
        @submit="handleSubmit"
      >
        <template #description>
          首次登录? 请
          <ULink
            to="/signup"
            class="text-primary font-medium hover:text-primary"
          >
            注册
          </ULink>
          .
        </template>
        <template #password-hint>
          <span class="text-error">{{ passwordHint }}</span>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>
