<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  { label: "仪表盘", to: "/dashboard", active: route.path === "/dashboard" },
])
</script>

<template>
  <UHeader>
    <template #title>
      <p>HMO - Minecraft</p>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>

<style scoped>

</style>
