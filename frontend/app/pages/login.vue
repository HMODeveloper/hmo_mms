<script setup lang="ts">
import * as z from "zod"
import type { AuthFormField } from "@nuxt/ui"

definePageMeta({
  layout: false,
})

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

const handleSubmit = (payload: FormSubmitEvent<Schema>) => {
  console.log("Form submitted:", payload.data)
}
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="登录"
        icon="i-lucide-user"
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
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>
