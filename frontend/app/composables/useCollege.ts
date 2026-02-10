import type { CollegeInfo } from "~/models/college"
import { getSignUpInfo } from "~/apis/signup"

export function useCollege() {
  const colleges = useState<CollegeInfo[]>("collegeInfo", () => [])
  const isInitialized = useState<boolean>("isCollegeInitialized", () => false)

  const initCollegeInfo = async () => {
    if (isInitialized.value)
      return

    try {
      const response = await getSignUpInfo()
      colleges.value = response.colleges
    }
    catch (error) {
      console.error("学院信息获取失败: ", error)
    }
    finally {
      isInitialized.value = true
    }
  }

  onMounted(() => {
    void initCollegeInfo()
  })

  return {
    colleges: readonly(colleges),
  }
}
