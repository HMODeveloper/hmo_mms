<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const userStore = useUserStore()
const userInfo = userStore.userInfo
</script>

<template>
  <UPageSection>
    <p class="text-2xl">
      欢迎回来: {{ userInfo?.nickname }}
    </p>
  </UPageSection>
</template>

<style scoped>

</style>
