import type { UserInfo } from "~/models/user"
import { getUserInfo, userLogout } from "~/apis/auth"

export function useAuth() {
  const userInfo = useState<UserInfo | null>("userInfo", () => null)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  const initUserInfo = async () => {
    try {
      const response = await getUserInfo()
      setUserInfo(response)
    }
    catch (error) {
      clearUserInfo()
      throw error
    }
  }

  const logout = async () => {
    try {
      await userLogout()
    }
    finally {
      clearUserInfo()
      await navigateTo("/")
    }
  }

  const isAuthenticated = computed(() => !!userInfo.value)

  return {
    userInfo: readonly(userInfo),
    setUserInfo,
    clearUserInfo,
    initUserInfo,
    logout,
    isAuthenticated,
  }
}
