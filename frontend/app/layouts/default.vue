<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const route = useRoute()
const { userInfo, logout } = useAuth()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: "仪表盘", to: "/dashboard", active: route.path === "/dashboard" },
  { label: "社员信息", to: "/member", active: route.path.startsWith("/member") },
  { label: "部门管理", to: "/department", active: route.path.startsWith("/department") },
  { label: "超管功能", to: "/superadmin", active: route.path.startsWith("/superadmin") },
  { label: "个人中心", to: "/user", active: route.path === "/user" },
])

onMounted(() => {

})
</script>

<template>
  <UHeader title="社员管理系统">
    <UNavigationMenu :items="navItems" />

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://github.com/HMODeveloper/hmo_mms"
        target="_blank"
        icon="i-tabler-brand-github"
        aria-label="GitHub"
      />

      <UPopover>
        <UButton>
          {{ userInfo?.nickname.charAt(0) }}
        </UButton>

        <template #content>
          <div class="flex flex-col">
            <UButton
              color="neutral"
              size="xl"
              variant="link"
              to="/user"
            >
              {{ userInfo?.nickname || "用户" }}
            </UButton>
            <UButton
              color="neutral"
              variant="link"
              to="/user"
              icon="i-tabler-user"
            >
              个人中心
            </UButton>
            <UButton
              color="error"
              variant="link"
              icon="i-tabler-logout"
              @click="logout"
            >
              退出登录
            </UButton>
          </div>
        </template>
      </UPopover>
    </template>

    <template #body>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
  <UPage>
    <slot />
  </UPage>
</template>

<style scoped>

</style>
