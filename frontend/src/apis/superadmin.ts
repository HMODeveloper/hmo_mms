import request from "@/src/lib/client"

export async function addAdmin(QQID: string) {
  return await request.post("/admin", { QQID })
}

export async function removeAdmin(QQID: string) {
  return await request.delete(`/admin/${QQID}`)
}

export async function addSuperAdmin(QQID: string) {
  return await request.post("/superadmin", { QQID })
}

export async function removeSuperAdmin(QQID: string) {
  return await request.delete(`/superadmin/${QQID}`)
}
