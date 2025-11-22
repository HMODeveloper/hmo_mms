<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui"

definePageMeta({
  layout: false,
})

const items: ButtonProps[] = [
  {
    label: "登录",
    to: "/login",
    trailingIcon: "i-tabler-login",
    size: "xl",
  },
]
</script>

<template>
  <UMain>
    <UPageHero
      title="HMO - MMS"
      description="HMO - Minecraft 岳麓幻境社成员管理系统"
      :links="items"
    />
  </UMain>
</template>

<style scoped>

</style>
