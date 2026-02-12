import request from "@/src/lib/client"

export async function addAdmin(QQID: number) {
  return await request.post("/admin", { QQID })
}

export async function removeAdmin(QQID: number) {
  return await request.delete(`/admin/${QQID}`)
}

export async function addSuperAdmin(QQID: number) {
  return await request.post("/superadmin", { QQID })
}

export async function removeSuperAdmin(QQID: number) {
  return await request.delete(`/superadmin/${QQID}`)
}
