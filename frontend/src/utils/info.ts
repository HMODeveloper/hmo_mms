import type { UserDepartmentInfo } from "@/src/models/user"
import dayjs from "dayjs"
import { useColleges } from "@/src/stores/colleges"

export function createUserFormatter() {
  const { colleges } = useColleges()

  const formatCreateAt = (createAt?: string) => {
    if (!createAt)
      return "---"
    return dayjs(createAt).format("YYYY-MM-DD")
  }

  const formatDepartment = (departments?: UserDepartmentInfo[]) => {
    if (!departments || departments.length === 0)
      return "无"
    return departments.map(item => item.name).join(", ")
  }

  const formatMajorClass = (grade?: number, classIndex?: number, major?: string) => {
    if (!grade || !classIndex || !major)
      return "---"

    const yy = grade.toString().slice(-2)
    const index = classIndex.toString().padStart(2, "0")
    return `${major}${yy}${index}`
  }

  const getCollegeName = (collegeCode?: string) => {
    if (!collegeCode)
      return "---"
    return colleges.find(item => item.code === collegeCode)?.name || collegeCode
  }

  return {
    formatCreateAt,
    formatDepartment,
    formatMajorClass,
    getCollegeName,
  }
}
