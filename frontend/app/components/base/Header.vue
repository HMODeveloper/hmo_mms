<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

import { logoutAPI } from "~/apis/auth"
import { useUserStore } from "~/stores/user"

const route = useRoute()
const userStore = useUserStore()

const items = computed<NavigationMenuItem[]>(() => [
  { label: "仪表盘", to: "/dashboard", active: route.path === "/dashboard" },
  { label: "成员列表", to: "/members", active: route.path === "/members" },
  { label: "个人中心", to: "/profile", active: route.path === "/profile" },
])

const handleLogout = () => {
  logoutAPI()
    .then((_response) => {
      userStore.clearUserInfo()
      console.log(userStore.userInfo)
      navigateTo("/")
    })
}
</script>

<template>
  <UHeader>
    <template #title>
      <p>HMO - Minecraft</p>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UButton
        color="primary"
        label="退出登录"
        icon="i-tabler-logout"
        @click="handleLogout"
      />
    </template>
  </UHeader>
</template>

<style scoped>

</style>
