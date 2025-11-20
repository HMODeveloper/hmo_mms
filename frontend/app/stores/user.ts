import { ref } from "vue"
import { defineStore } from "pinia"

export interface UserInfo {
  userID: number
  token: string
}

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo | null>(null)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  }
})
