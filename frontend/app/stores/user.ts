import type { UserInfo } from "~/models/user"
import { defineStore } from "pinia"
import { ref } from "vue"
import { userLogout } from "~/apis/auth"

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo | null>(null)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const logout = () => {
    userLogout()
      .finally(() => {
        userInfo.value = null
        navigateTo("/")
      })
  }

  return {
    userInfo,
    setUserInfo,
    logout,
  }
})
