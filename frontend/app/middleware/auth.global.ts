import { getUserInfo } from "~/apis/auth.server"

const EXCLUDE_PATHS = ["/", "/signup"]

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { isAuthenticated, setUserInfo, clearUserInfo } = useAuth()

  if (!isAuthenticated.value) {
    const { data, error } = await useAsyncData(getUserInfo)
    if (data.value) {
      setUserInfo(data.value)
    }
    if (error.value) {
      clearUserInfo()
      console.error("初始化登录失败: ", error.value)
    }
  }

  if (!EXCLUDE_PATHS.includes(to.path) && !isAuthenticated.value) {
    return navigateTo("/")
  }
})
