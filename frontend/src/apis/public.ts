import type { CollegeListResponse } from "@/src/schema/public"
import request from "@/src/lib/client"

export async function getCollegesInfo() {
  return await request.get<CollegeListResponse>("/public/college")
}
