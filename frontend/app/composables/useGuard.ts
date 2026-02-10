import type { UserLevel } from "@/models/user"

const USER_LEVEL_RANK: Record<UserLevel, number> = {
  superadmin: 3,
  admin: 2,
  member: 1,
}

export function useGuard(level: UserLevel | null = null) {
  const { userInfo, isAuthenticated, initUserInfo } = useAuth()

  onMounted(async () => {
    if (!isAuthenticated.value) {
      try {
        await initUserInfo()
      }
      catch (error) {
        console.error("信息获取失败: ", error)
        navigateTo("/")
      }
    }

    if (level && userInfo.value && USER_LEVEL_RANK[userInfo.value.level] < USER_LEVEL_RANK[level]) {
      navigateTo("/")
    }
  })
}
