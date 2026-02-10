<script setup>
const { isAuthenticated, initUserInfo } = useAuth()
const toast = useToast()

onMounted(() => {
  if (!isAuthenticated) {
    initUserInfo()
      .catch((_error) => {
        toast.add({
          title: "自动登录失败",
          color: "error",
        })
      })
  }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
