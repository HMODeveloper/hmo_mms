<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
import { changePasswordAPI } from "~/apis/profile"
import { logoutAPI } from "~/apis/auth"
import type { ChangePasswordRequest } from "~/apis/profile"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const toast = useToast()
const userStore = useUserStore()

const fields = ref<AuthFormField[]>([
  {
    name: "oldPassword",
    type: "password",
    label: "旧密码",
    placeholder: "请输入旧密码",
    required: true,
  },
  {
    name: "newPassword",
    type: "password",
    label: "新密码",
    placeholder: "请输入新密码",
    required: true,
  },
])

const schema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})

type Schema = z.output<typeof schema>

const handleSubmit = async (payload: FormSubmitEvent<Schema>) => {
  const request: ChangePasswordRequest = {
    oldPassword: payload.data.oldPassword,
    newPassword: payload.data.newPassword,
  }

  changePasswordAPI(request)
    .then(() => {
      logoutAPI()
        .then((_response) => {
          userStore.clearUserInfo()
          console.log(userStore.userInfo)
          navigateTo("/")
        })
    })
    .catch((error) => {
      switch (error.code) {
        case "INVALID_OLD_PASSWORD":
          toast.add({
            title: "旧密码错误.",
          })
          break

        case "SAME_AS_OLD_PASSWORD":
          toast.add({
            title: "新旧密码不能相同",
          })
          break

        default:
          toast.add({
            title: "服务器错误, 请稍后重试.",
          })
      }
    })
}
</script>

<template>
  <UPageSection>
    <div class="w-full h-full flex items-center justify-center">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          title="修改密码"
          :fields="fields"
          :schema="schema"
          :submit="{
            label: '修改密码',
            color: 'primary',
          }"
          @submit="handleSubmit"
        />
      </UPageCard>
    </div>
  </UPageSection>
</template>

<style scoped>

</style>
