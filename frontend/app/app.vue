<script setup>
import { getUserInfo } from "~/apis/auth.server"
import { useUserStore } from "~/stores/user"

const { setUserInfo, logout } = useUserStore()

const { data: userInfo, error } = await useAsyncData("userInfo", getUserInfo)

onMounted(() => {
  if (error.value) {
    logout()
  }
  else if (userInfo.value) {
    setUserInfo(userInfo.value)
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
