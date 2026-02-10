<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui"
import dayjs from "dayjs"
import * as z from "zod"

const { userInfo } = useAuth()
const { colleges } = useCollege()

const collegeSelectItem = computed<SelectMenuItem[]>(() => colleges.value.map(item => ({
  label: item.name,
  value: item.code,
})))

const status = ref<"view" | "edit">("view")
const isEditing = computed(() => status.value === "edit")

const schema = z.object({
  nickname: z.string(" "),
  mcName: z.string(" ").nullable(),
  realName: z.string(" "),
  studentID: z.string(" ").nullable(),
  college: z.string(" "),
  school: z.string(" ").nullable(),
  major: z.string(" ").nullable(),
  grade: z.number(" ").nullable(),
  classIndex: z.number(" ").nullable(),
})

type Schema = z.output<typeof schema>

const state = computed<Partial<Schema>>(() => ({
  nickname: userInfo.value?.nickname,
  mcName: userInfo.value?.mcName,
  realName: userInfo.value?.realName,
  studentID: userInfo.value?.studentID,
  college: userInfo.value?.college,
  school: userInfo.value?.school,
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

        <!-- 学院字段: 显示为文本, 编辑时显示枚举 -->
        <UserProfileFeature
          v-if="!isEditing"
          :model-value="colleges.find(item => item.code === state.college)?.name || '未选择学院'"
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

        <!-- 学校字段: 仅外校学生显示 -->
        <UserProfileFeature
          v-if="state.college === 'NOT_HNU'"
          v-model="state.school"
          label="学校"
          icon="i-tabler-building"
          :editing="isEditing"
        />

        <!-- 专业班级字段: 外校学生不显示, 显示时组合显示, 编辑时分开显示 -->
        <template v-if="state.college !== 'NOT_HNU'">
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
        </template>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserProfileFeature
          :model-value="userInfo?.level"
          label="用户等级"
          icon="i-tabler-shield-check"
        />

        <UserProfileFeature
          :model-value="userInfo?.departments?.map(item => item.name).join(', ') || '不属于任何部门'"
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
