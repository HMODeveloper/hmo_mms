<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui"

import * as z from "zod"

definePageMeta({
  layout: false,
})

const toast = useToast()

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

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log("Submitted", payload)
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
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageHero>
  </UMain>
</template>

<style scoped>

</style>
