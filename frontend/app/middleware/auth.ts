export default defineNuxtRouteMiddleware((to, _from) => {
  const userStore = useUserStore()
  const isAuthenticated = !!userStore.userInfo?.token

  console.log(isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    return navigateTo("/login")
  }

  if (to.path === "/login" && isAuthenticated) {
    return navigateTo("/")
  }
})
