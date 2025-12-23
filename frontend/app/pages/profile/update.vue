<script setup lang="ts">
import { getProfileAPI } from "~/apis/profile"
import { type GetProfileResponse, type ProfileUpdateRequest, updateProfileAPI } from "~/apis/profile"
import dayjs from "dayjs"
import { type CollegeInfo, getCollegeListAPI } from "~/apis/signup"
import type { SelectMenuItem } from "@nuxt/ui"
import * as z from "zod"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const profile: GetProfileResponse = (await getProfileAPI()).data

const collegeList: CollegeInfo[] = (await getCollegeListAPI()).data.colleges
const collegeSelectItems = ref<SelectMenuItem[]>(
  collegeList.map(college => ({
    label: college.name,
    id: college.code,
  }) as SelectMenuItem) || [],
)

const _schema = z.object({
  QQID: z.number(),
  nickname: z.string(),
  password: z.string(),
  passwordConfirm: z.string(),
  MCName: z.string().nullable(),
  realName: z.string(),
  studentID: z.string(),
  collegeName: z.string(),
  major: z.string().nullable(),
  grade: z.number().nullable(),
  classIndex: z.number().nullable(),
})

type Schema = z.output<typeof _schema>

const state = reactive<Partial<Schema>>({
  nickname: profile.nickname,
  MCName: profile.MCName,
  realName: profile.realName,
  studentID: profile.studentID,
  collegeName: profile.collegeName,
  major: profile.major,
  grade: profile.grade,
  classIndex: profile.classIndex,
})

const toast = useToast()

const createAtFormat = () => dayjs(profile.createAt).format("YYYY-MM-DD")

const departmentFormat = () => {
  if (profile.departments.length === 0) {
    return "无"
  }
  return profile.departments.map(item => item.name).join(", ")
}

const majorClassFormat = computed(() => {
  const yy = state.grade!.toString().slice(-2)
  const index = state.classIndex!.toString().padStart(2, "0")
  return `${state.major}${yy}${index}`
})

const handleReset = () => {
  state.nickname = profile.nickname
  state.MCName = profile.MCName
  state.realName = profile.realName
  state.studentID = profile.studentID
  state.collegeName = profile.collegeName
  state.major = profile.major
  state.grade = profile.grade
  state.classIndex = profile.classIndex
}

const handleSubmit = () => {
  const data = state
  if (!data.nickname || !data.realName || !data.studentID || !data.collegeName) {
    return
  }

  const updateRequest: ProfileUpdateRequest = {
    nickname: state.nickname!,
    MCName: state.MCName || undefined,
    realName: state.realName,
    studentID: state.studentID,
    collegeName: state.collegeName,
    major: state.major || undefined,
    grade: state.grade || undefined,
    classIndex: state.classIndex || undefined,
  }

  updateProfileAPI(updateRequest)
    .then((_response) => {
      toast.add({
        title: "信息修改成功!",
      })
      navigateTo("/profile")
    })
    .catch((error) => {
      switch (error.code) {
        case "INVALID_NICKNAME":
          toast.add({
            title: "昵称不能为空, 请重新输入.",
          })
          break

        case "INVALID_REAL_NAME":
          toast.add({
            title: "真实姓名不能为空, 请重新输入.",
          })
          break

        default:
          toast.add({
            title: "修改失败, 请稍后重试.",
          })
          break
      }
    })
}
</script>

<template>
  <UContainer class="mt-4 py-2">
    <UForm :state="state">
      <p class="text-4xl font-bold">
        修改个人信息
      </p>
      <BaseSection
        title="基本信息"
        icon="i-tabler-info-circle"
      >
        <div class="w-full grid grid-cols-3 gap-4 mt-4">
          <UFormField
            label="昵称"
            name="nickname"
            class="flex-1"
          >
            <UInput
              v-model="state.nickname"
              placeholder="请输入昵称"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
          <UFormField
            label="QQ 号"
            name="QQID"
            class="flex-1"
          >
            <UInput
              type="text"
              class="w-full max-w-md"
              :model-value="profile.QQID"
              disabled
            />
          </UFormField>
          <UFormField
            label="游戏 ID"
            name="MCName"
            class="flex-1"
          >
            <UInput
              v-model="state.MCName"
              placeholder="请输入游戏 ID"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
        </div>
      </BaseSection>
      <BaseSection
        title="入库信息"
        icon="i-tabler-database"
      >
        <div class="w-full grid grid-cols-3 gap-4 mt-4">
          <UFormField
            label="登记时间"
            class="flex-1"
          >
            <UInput
              type="text"
              class="w-full max-w-md"
              :model-value="createAtFormat()"
              disabled
            />
          </UFormField>
          <UFormField
            label="用户等级"
            class="flex-1"
          >
            <UInput
              type="text"
              class="w-full max-w-md"
              :model-value="profile.level"
              disabled
            />
          </UFormField>
          <UFormField
            label="任职部门"
            class="flex-1"
          >
            <UInput
              type="text"
              class="w-full max-w-md"
              :model-value="departmentFormat()"
              disabled
            />
          </UFormField>
        </div>
      </BaseSection>
      <BaseSection
        title="个人信息"
        icon="i-tabler-eye"
      >
        <div class="w-full grid grid-cols-4 gap-4 mt-4">
          <UFormField
            label="学院"
            name="college"
            class="flex-1"
          >
            <USelectMenu
              v-model="state.collegeName"
              value-key="id"
              :items="collegeSelectItems"
              placeholder="请选择学院"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
          <UFormField
            :label="state.collegeName === 'NOT_HNU' ? '学校' : '专业'"
            name="major"
            class="flex-1"
          >
            <UInput
              v-model="state.major"
              :placeholder="state.collegeName === 'NOT_HNU' ? '请输入学校名' : '请输入专业'"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
          <UFormField
            label="班级序号"
            name="classIndex"
            class="flex-1"
          >
            <UInput
              v-model="state.classIndex"
              placeholder="请输入班级序号"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
          <UFormField
            label="班级"
            class="flex-1"
          >
            <UInput
              type="text"
              class="w-full max-w-md"
              :model-value="majorClassFormat"
              disabled
            />
          </UFormField>
        </div>

        <div class="w-full grid grid-cols-3 gap-4 mt-4">
          <UFormField
            label="姓名"
            name="realName"
            class="flex-1"
          >
            <UInput
              v-model="state.realName"
              placeholder="请输入真实姓名"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
          <UFormField
            label="学号"
            name="studentID"
            class="flex-1"
          >
            <UInput
              v-model="state.studentID"
              placeholder="请输入学号"
              type="text"
              class="w-full max-w-md"
            />
          </UFormField>
        </div>
      </BaseSection>

      <div class="w-full mt-4 flex items-center justify-end gap-4">
        <UButton
          size="xl"
          variant="outline"
          color="neutral"
          icon="i-tabler-arrow-left"
          to="/profile"
        >
          返回
        </UButton>
        <UButton
          size="xl"
          color="info"
          icon="i-tabler-refresh"
          @click="handleReset"
        >
          重置
        </UButton>
        <UButton
          size="xl"
          color="secondary"
          icon="i-tabler-check"
          @click="handleSubmit"
        >
          确认
        </UButton>
      </div>
    </UForm>
  </UContainer>
</template>

<style scoped>

</style>
