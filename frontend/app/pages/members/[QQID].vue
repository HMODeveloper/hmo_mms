<script setup lang="ts">
import { type MemberInfo, memberProfileAPI } from "~/apis/member"
import dayjs from "dayjs"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const route = useRoute()

const profile = ref<MemberInfo | null>(null)

const createAtFormat = computed(() =>
  profile.value
    ? dayjs(profile.value.createAt).format("YYYY-MM-DD")
    : "",
)

const departmentFormat = computed(() => {
  if (profile.value) {
    if (profile.value.departments.length === 0) {
      return "无"
    }
    return profile.value.departments.map(item => item.name).join(", ")
  }
  return ""
})

const majorClassFormat = computed(() => {
  if (profile.value) {
    const yy = profile.value.grade.toString().slice(-2)
    const index = profile.value.classIndex.toString().padStart(2, "0")
    return `${profile.value.major}${yy}${index}`
  }
  return ""
})

onMounted(() => {
  const rawQQID = route.params.QQID
  const QQID = Number(rawQQID)

  if (!isNaN(QQID) && isFinite(QQID) && rawQQID != null && rawQQID !== "") {
    memberProfileAPI(QQID)
      .then((response) => {
        profile.value = response.data
      })
      .catch((error) => {
        switch (error.code) {
          case "USER_NOT_FOUND":
            profile.value = null
            console.log("用户不存在")
            break
        }
      })
  }
  else {
    console.log("无效的 QQID")
  }
})
</script>

<template>
  <UContainer class="mt-4 py-2">
    <template v-if="profile">
      <BaseSection
        title="基本信息"
        icon="i-tabler-info-circle"
      >
        <div class="w-full grid grid-cols-3">
          <UPageCard variant="ghost">
            <UPageFeature
              title="昵称"
              icon="i-tabler-user"
              :description="profile.nickname"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="QQ 号"
              icon="i-tabler-brand-qq"
              :description="`${profile.QQID}`"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="游戏 ID"
              icon="i-tabler-brand-minecraft"
              :description="profile.MCName"
            />
          </UPageCard>
        </div>
      </BaseSection>
      <BaseSection
        title="入库信息"
        icon="i-tabler-database"
      >
        <div class="w-full grid grid-cols-3">
          <UPageCard variant="ghost">
            <UPageFeature
              title="登记时间"
              icon="i-tabler-calendar-user"
              :description="createAtFormat"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="用户等级"
              icon="i-tabler-certificate"
              :description="profile.level"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="任职部门"
              icon="i-tabler-calendar-user"
              :description="departmentFormat"
            />
          </UPageCard>
        </div>
      </BaseSection>
      <BaseSection
        title="个人信息"
        icon="i-tabler-eye"
      >
        <div class="w-full grid grid-cols-4">
          <UPageCard variant="ghost">
            <UPageFeature
              title="学院"
              icon="i-tabler-building-community"
              :description="profile.collegeName"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="专业班级"
              icon="i-tabler-school"
              :description="majorClassFormat"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="姓名"
              icon="i-tabler-id-badge-2"
              :description="profile.realName"
            />
          </UPageCard>
          <UPageCard variant="ghost">
            <UPageFeature
              title="学号"
              icon="i-tabler-id"
              :description="profile.studentID"
            />
          </UPageCard>
        </div>
      </BaseSection>
    </template>
    <template v-else>
      <UAlert
        type="warning"
        class="w-full"
      >
        用户不存在!
      </UAlert>
    </template>

    <div class="w-full mt-4 flex items-center justify-end gap-4">
      <UButton
        size="xl"
        color="info"
        to="/profile/update"
      >
        编辑资料
      </UButton>
      <UButton
        size="xl"
        color="warning"
        to="/profile/change-password"
      >
        修改密码
      </UButton>
    </div>
  </UContainer>
</template>

<style scoped>

</style>
