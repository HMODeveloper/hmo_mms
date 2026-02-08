<script setup>
import { getUserInfo } from "~/apis/auth.server"

const { setUserInfo, logout } = useAuth()

const { data: userInfoData, error } = await useAsyncData("userInfo", getUserInfo)

if (error.value) {
  logout()
}
else if (userInfoData.value) {
  setUserInfo(userInfoData.value)
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
