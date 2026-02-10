<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui"
import dayjs from "dayjs"
import * as z from "zod"
import { getSignUpInfo } from "~/apis/signup"

const { userInfo } = useAuth()
const toast = useToast()

const colleges = await getSignUpInfo()
  .then(response => response.colleges)
  .catch((_error) => {
    toast.add({
      title: "学院信息获取错误",
      color: "error",
    })
    return []
  })

const collegeSelectItem = computed<SelectMenuItem[]>(() => colleges.map(item => ({
  label: item.name,
  value: item.code,
})))

const status = ref<"view" | "edit">("view")
const isEditing = computed(() => status.value === "edit")

const schema = z.object({
  nickname: z.string(" "),
  mcName: z.string(" "),
  realName: z.string(" "),
  studentID: z.string(" "),
  collegeName: z.string(" "),
  major: z.string(" "),
  grade: z.number(" "),
  classIndex: z.number(" "),
})

type Schema = z.output<typeof schema>

const state = computed<Partial<Schema>>(() => ({
  nickname: userInfo.value?.nickname,
  mcName: userInfo.value?.mcName,
  realName: userInfo.value?.realName,
  studentID: userInfo.value?.studentID,
  collegeName: userInfo.value?.collegeName,
  major: userInfo.value?.major,
  grade: userInfo.value?.grade,
  classIndex: userInfo.value?.classIndex,
}))

const majorClass = computed(() => {
  const yy = state.value.grade?.toString().slice(-2)
  const index = state.value.classIndex?.toString().padStart(2, "0")
  if (yy && index && state.value.major)
    return `${state.value.major}${yy}${index}`
  return "---"
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        用户信息
      </h3>
    </template>

    <UForm class="w-full flex flex-col gap-4" :schema="schema" :state="state">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserProfileFeature
          :model-value="userInfo?.QQID"
          label="QQ 号"
          icon="i-tabler-brand-qq"
        />
        <UserProfileFeature
          v-model="state.nickname"
          label="昵称"
          icon="i-tabler-user"
          :editing="isEditing"
        />
        <UserProfileFeature
          v-model="state.mcName"
          label="MC 用户名"
          icon="i-tabler-device-gamepad-2"
          :editing="isEditing"
        />
        <UserProfileFeature
          :model-value="userInfo?.createAt ? dayjs(userInfo.createAt).format('YYYY-MM-DD') : ''"
          label="注册时间"
          icon="i-tabler-calendar-time"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserProfileFeature
          v-model="state.realName"
          label="真实姓名"
          icon="i-tabler-id-badge"
          :editing="isEditing"
        />

        <UserProfileFeature
          v-model="state.studentID"
          label="学号"
          icon="i-tabler-school"
          :editing="isEditing"
        />

        <UserProfileFeature
          v-if="!isEditing"
          v-model="state.collegeName"
          label="学院"
          icon="i-tabler-building-bank"
        />

        <UPageFeature
          title="学院"
          icon="i-tabler-building-bank"
        >
          <template #description>
            <USelectMenu
              :items="collegeSelectItem"
              value-key="value"
              class="-ml-2 w-45"
            />
          </template>
        </UPageFeature>

        <UserProfileFeature
          v-if="!isEditing"
          :model-value="majorClass"
          label="专业班级"
          icon="i-tabler-certificate"
        />

        <template v-if="isEditing">
          <UserProfileFeature
            v-model="state.major"
            label="专业"
            icon="i-tabler-book"
            :editing="isEditing"
          />

          <UserProfileFeature
            v-model="state.grade"
            label="年级"
            icon="i-tabler-number"
            type="number"
            :editing="isEditing"
          />

          <UserProfileFeature
            v-model="state.classIndex"
            label="班级序号"
            icon="i-tabler-users-group"
            type="number"
            :editing="isEditing"
          />
        </template>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserProfileFeature
          :model-value="userInfo?.level"
          label="用户等级"
          icon="i-tabler-shield-check"
        />

        <UserProfileFeature
          :model-value="userInfo?.departments?.map(d => d.name).join(', ') || '不属于任何部门'"
          label="所属部门"
          icon="i-tabler-building"
        />
      </div>
    </UForm>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          v-if="isEditing"
          color="error"
          variant="outline"
          @click="status = 'view'"
        >
          取消
        </UButton>
        <UButton
          v-if="isEditing"
          color="success"
          @click="status = 'view'"
        >
          保存
        </UButton>
        <UButton
          v-if="!isEditing"
          color="primary"
          @click="status = 'edit'"
        >
          编辑
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<style scoped>

</style>
