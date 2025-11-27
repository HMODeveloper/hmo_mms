<script setup lang="ts">
import { getProfileAPI } from "~/apis/profile"
import type { GetProfileResponse } from "~/apis/profile"
import dayjs from "dayjs"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const profile: GetProfileResponse = (await getProfileAPI()).data

const createAtFormat = () => dayjs(profile.createAt).format("YYYY-MM-DD")

const departmentFormat = () => {
  if (profile.departments.length === 0) {
    return "无"
  }
  return profile.departments.map(item => item.name).join(", ")
}

const majorClassFormat = () => {
  const yy = profile.grade.toString().slice(-2)
  const index = profile.classIndex.toString().padStart(2, "0")
  return `${profile.major}${yy}${index}`
}
</script>

<template>
  <UContainer class="mt-4 py-2">
    <p class="text-4xl font-bold">
      你好, {{ profile.nickname }} !
    </p>
    <ProfileSection
      title="基本信息"
      icon="i-tabler-info-circle"
    >
      <div class="w-full grid grid-cols-3">
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="昵称"
            icon="i-tabler-user"
            :description="profile.nickname"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="QQ 号"
            icon="i-tabler-brand-qq"
            :description="`${profile.QQID}`"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="游戏 ID"
            icon="i-tabler-brand-minecraft"
            :description="profile.MCName"
          />
        </UPageCard>
      </div>
    </ProfileSection>
    <ProfileSection
      title="入库信息"
      icon="i-tabler-database"
    >
      <div class="w-full grid grid-cols-3">
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="登记时间"
            icon="i-tabler-calendar-user"
            :description="createAtFormat()"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="用户等级"
            icon="i-tabler-certificate"
            :description="profile.level"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="任职部门"
            icon="i-tabler-calendar-user"
            :description="departmentFormat()"
          />
        </UPageCard>
      </div>
    </ProfileSection>
    <ProfileSection
      title="个人信息"
      icon="i-tabler-eye"
    >
      <div class="w-full grid grid-cols-4">
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="学院"
            icon="i-tabler-building-community"
            :description="profile.collegeName"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="专业班级"
            icon="i-tabler-school"
            :description="majorClassFormat()"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="姓名"
            icon="i-tabler-id-badge-2"
            :description="profile.realName"
          />
        </UPageCard>
        <UPageCard
          variant="ghost"
        >
          <UPageFeature
            title="学号"
            icon="i-tabler-id"
            :description="profile.studentID"
          />
        </UPageCard>
      </div>
    </ProfileSection>

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
