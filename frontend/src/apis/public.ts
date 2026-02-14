import type { CollegeInfo } from "@/src/models/college"
import request from "@/src/lib/client"

export async function getCollegesInfo() {
  return await request.get<CollegeInfo[]>("/public/college")
}
