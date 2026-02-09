export async function addAdmin(QQID: number) {
  return await useRequest().post("/admin", { QQID })
}

export async function removeAdmin(QQID: number) {
  return await useRequest().delete(`/admin/${QQID}`)
}

export async function addSuperAdmin(QQID: number) {
  return await useRequest().post("/superadmin", { QQID })
}

export async function removeSuperAdmin(QQID: number) {
  return await useRequest().delete(`/superadmin/${QQID}`)
}
