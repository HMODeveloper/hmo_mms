const EXCLUDE_PATHS = ["/", "/signup"]

export default defineNuxtRouteMiddleware((to, _from) => {
  const { isAuthenticated } = useAuth()

  if (!EXCLUDE_PATHS.includes(to.path) && !isAuthenticated.value) {
    return navigateTo("/")
  }
})
