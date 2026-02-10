import type { UserInfo } from "~/models/user"
import { getUserInfo, userLogout } from "~/apis/auth"

export function useAuth() {
  const userInfo = useState<UserInfo | null>("userInfo", () => null)
  const isInitialized = useState<boolean>("isAuthInitialized", () => false)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  const initUserInfo = async () => {
    if (isInitialized.value)
      return

    const toast = useToast()
    try {
      const response = await getUserInfo()
      setUserInfo(response)
      toast.add({
        title: "自动登录成功",
        color: "success",
      })
    }
    catch (error) {
      clearUserInfo()
      console.error("自动登录失败: ", error)
      toast.add({
        title: "自动登录失败",
        color: "error",
      })
    }
    finally {
      isInitialized.value = true
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
    isInitialized: readonly(isInitialized),
  }
}
