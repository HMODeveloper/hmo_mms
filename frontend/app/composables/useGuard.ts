import type { UserLevel } from "@/models/user"

const USER_LEVEL_RANK: Record<UserLevel, number> = {
  superadmin: 3,
  admin: 2,
  member: 1,
}

export function useGuard(level: UserLevel | null = null) {
  const { userInfo, initUserInfo, isAuthenticated, isInitialized } = useAuth()

  onMounted(async () => {
    if (!isInitialized.value) {
      await initUserInfo()
    }

    if (!isAuthenticated.value) {
      navigateTo("/")
      return
    }

    if (level && userInfo.value && USER_LEVEL_RANK[userInfo.value.level] < USER_LEVEL_RANK[level]) {
      navigateTo("/")
    }
  })
}
