<script setup lang="ts">
import * as z from "zod"
import type { SelectMenuItem } from "@nuxt/ui"

import type { CollegeInfo, SignUpRequest } from "~/apis/signup"
import { getCollegeListAPI, checkQQAPI, signUpAPI } from "~/apis/signup"

definePageMeta({
  layout: false,
})

const collegeList: CollegeInfo[] = (await getCollegeListAPI()).data.colleges
const collegeSelectItems = ref<SelectMenuItem[]>(
  collegeList.map(college => ({
    label: college.name,
    id: college.code,
  }) as SelectMenuItem) || [],
)

const QQHint = ref<string>("")
const isQQChecked = ref<boolean>(false)
const toast = useToast()

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
  QQID: undefined,
  nickname: undefined,
  password: undefined,
  passwordConfirm: undefined,
  MCName: undefined,
  realName: undefined,
  studentID: undefined,
  collegeName: undefined,
  major: undefined,
  grade: undefined,
  classIndex: undefined,
})

const handleQQCheck = async () => {
  if (state.QQID === undefined) {
    QQHint.value = "请输入有效的 QQ 号"
    return
  }

  const data = {
    qq_id: state.QQID,
  }

  checkQQAPI(data)
    .then((_response) => {
      isQQChecked.value = true
      QQHint.value = ""
    })
    .catch((error) => {
      isQQChecked.value = false
      if (error.code === "QQID_EXISTS") {
        QQHint.value = "该 QQ 号已被注册."
      }
    })
}

const handleSubmit = async () => {
  const data = state
  if (!data.QQID || !data.nickname || !data.password || !data.passwordConfirm || !data.realName || !data.studentID || !data.collegeName) {
    return
  }

  if (data.password !== data.passwordConfirm) {
    toast.add({
      title: "两次密码不一致",
    })
    return
  }

  const signUpRequest: SignUpRequest = {
    QQID: state.QQID!,
    nickname: state.nickname!,
    password: state.password!,
    MCName: state.MCName || undefined,
    realName: state.realName!,
    studentID: state.studentID!,
    collegeName: state.collegeName!,
    major: state.major || undefined,
    grade: state.grade || undefined,
    classIndex: state.classIndex || undefined,
  }

  signUpAPI(signUpRequest)
    .then((_response) => {
      toast.add({
        title: "注册成功! 请使用您的 QQ 号和密码登录.",
      })
      navigateTo("/login")
    })
    .catch((error) => {
      switch (error.code) {
        case "INTEGRITY_ERROR":
          toast.add({
            title: "注册失败, 请检查输入的信息是否正确.",
          })
          break

        default:
          toast.add({
            title: "注册失败, 请稍后重试.",
          })
          break
      }
    })
}
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard>
      <template #title>
        <p class="w-full text-center">
          注册新账号
        </p>
      </template>
      <template #description>
        <p class="w-full text-center">
          欢迎加入 HMO - Minecraft 岳麓幻境社! 请填写以下信息完成注册.
        </p>
      </template>

      <UForm
        class="w-full max-w-md flex flex-col items-center justify-center gap-4"
        :state="state"
      >
        <div class="w-full max-w-md">
          <UFormField
            label="QQ 号"
            name="QQID"
          >
            <template #hint>
              <span class="text-error">{{ QQHint }}</span>
            </template>

            <div class="flex items-center justify-center gap-2">
              <UInput
                v-model="state.QQID"
                placeholder="请输入 QQ 号"
                type="number"
                :disabled="isQQChecked"
                class="flex-1"
              />
              <UButton
                label="验证 QQ"
                :disabled="isQQChecked"
                @click="handleQQCheck"
              />
            </div>
          </UFormField>
        </div>

        <!-- 在 QQ 验证之后显示 -->
        <template v-if="state.QQID && isQQChecked">
          <div class="w-full max-w-md flex items-center justify-center gap-2">
            <UFormField
              label="昵称"
              name="nickname"
              class="flex-1"
              @submit="handleSubmit"
            >
              <UInput
                v-model="state.nickname"
                placeholder="请输入昵称"
                type="text"
                class="w-full max-w-md"
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

          <div class="w-full max-w-md flex items-center justify-center gap-2">
            <UFormField
              label="设置密码"
              name="password"
              class="flex-1"
            >
              <UInput
                v-model="state.password"
                placeholder="请设置密码"
                type="password"
                class="w-full max-w-md"
              />
            </UFormField>

            <UFormField
              label="确认密码"
              name="passwordConfirm"
              class="flex-1"
            >
              <UInput
                v-model="state.passwordConfirm"
                placeholder="请确认密码"
                type="password"
                class="w-full max-w-md"
              />
            </UFormField>
          </div>

          <div class="w-full max-w-md flex items-center justify-center gap-2">
            <UFormField
              label="真实名称"
              name="realName"
              class="flex-1"
            >
              <UInput
                v-model="state.realName"
                placeholder="请输入真实名称"
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

          <div class="w-full max-w-md flex items-center justify-center gap-2">
            <UFormField
              label="学院"
              name="collegeName"
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
          </div>

          <!-- 外校学生不显示年级班级设置 -->
          <div
            v-if="state.collegeName && state.collegeName !== 'NOT_HNU'"
            class="w-full max-w-md flex items-center justify-center gap-2"
          >
            <UFormField
              label="年级"
              name="grade"
              class="flex-1"
            >
              <UInput
                v-model="state.grade"
                placeholder="请输入年级(例如: 24)"
                type="number"
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
                placeholder="请输入班级序号(例如: 1)"
                type="number"
                class="w-full max-w-md"
              />
            </UFormField>
          </div>

          <!-- 注册按钮 -->
          <div class="w-full max-w-md">
            <UButton
              label="注册账号"
              type="submit"
              class="w-full flex items-center justify-center"
              @click="handleSubmit"
            />
          </div>
        </template>
      </UForm>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>
