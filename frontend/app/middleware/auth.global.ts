const EXCLUDE_PATHS = ["/", "/signup"]

export default defineNuxtRouteMiddleware((to, _from) => {
  const userInfo = useNuxtData("userInfo")
  const isAuthenticated = !!userInfo.data.value

  if (!EXCLUDE_PATHS.includes(to.path) && !isAuthenticated) {
    return navigateTo("/")
  }
})
