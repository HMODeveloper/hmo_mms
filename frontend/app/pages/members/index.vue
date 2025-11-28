<script setup lang="ts">
import { getSearchInfoAPI, memberSearchAPI } from "~/apis/member"
import type { MemberInfo, SearchInfoRespons, SearchRequest } from "~/apis/member"
import * as z from "zod"
import type { SelectItem } from "@nuxt/ui"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const memberList = ref<MemberInfo[]>([])
const searchInfo = ref<SearchInfoRespons | null>(null)

const departmentItems = computed<SelectItem[]>(() => {
  return searchInfo.value?.departments.map(item => ({
    label: item.name,
    id: item.code,
  })) || []
})

const collegeItems = computed<SelectItem[]>(() => {
  return searchInfo.value?.colleges.map(item => ({
    label: item.name,
    id: item.code,
  })) || []
})

const levelItems = computed<SelectItem[]>(() => {
  return searchInfo.value?.levels.map(item => ({
    label: item.level,
    id: item.code,
  })) || []
})

const schema = z.object({
  globalQuery: z.optional(z.string()),
  createAtStart: z.optional(z.iso.datetime()),
  createAtEnd: z.optional(z.iso.datetime()),
  colleges: z.array(z.string()),
  departments: z.array(z.string()),
  levels: z.array(z.string()),
  pageSize: z.optional(z.number().default(5)),
  pageIndex: z.optional(z.number().default(1)),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  globalQuery: undefined,
  createAtStart: undefined,
  createAtEnd: undefined,
  colleges: [],
  departments: [],
  levels: [],
  pageSize: 5,
  pageIndex: 1,
})

const handleReset = () => {
  state.globalQuery = undefined
  state.createAtStart = undefined
  state.createAtEnd = undefined
  state.colleges = []
  state.departments = []
  state.levels = []
  state.pageSize = 5
  state.pageIndex = 1
}

const handleSearch = () => {
  const data: SearchRequest = {
    globalQuery: state.globalQuery,
    createAtStart: state.createAtStart,
    createAtEnd: state.createAtEnd,
    colleges: state.colleges || [],
    departments: state.departments || [],
    levels: state.levels || [],
    pageSize: state.pageSize || 5,
    pageIndex: state.pageIndex || 1,
  }

  console.log(data)

  memberSearchAPI(data)
    .then((response) => {
      memberList.value = response.data.members
    })
    .catch((error) => {
      console.log(error)
    })
}

onMounted(async () => {
  memberList.value = (await memberSearchAPI({})).data.members
  searchInfo.value = (await getSearchInfoAPI()).data
})
</script>

<template>
  <UContainer class="mt-4 py-2">
    <BaseSection
      title="成员搜索"
      icon="i-tabler-search"
    >
      <UForm
        :schema="schema"
        :state="state"
      >
        <div class="grid grid-cols-3">
          <UPageCard variant="ghost">
            <UFormField
              label="全局搜索"
              name="globalQuery"
              class="w-full"
            >
              <UInput
                v-model="state.globalQuery"
                class="w-full"
              />
            </UFormField>
          </UPageCard>
          <UPageCard variant="ghost">
            <UFormField
              label="部门"
              name="departments"
              class="w-full"
            >
              <USelectMenu
                v-model="state.departments"
                multiple
                :items="departmentItems"
                value-key="id"
                class="w-full"
              />
            </UFormField>
          </UPageCard>
          <UPageCard variant="ghost">
            <UFormField
              label="用户级别"
              name="levels"
              class="w-full"
            >
              <USelectMenu
                v-model="state.levels"
                multiple
                :items="levelItems"
                value-key="id"
                class="w-full"
              />
            </UFormField>
          </UPageCard>
        </div>
        <div class="grid grid-cols-3">
          <UPageCard
            variant="ghost"
            class="col-span-2"
          >
            <UFormField
              label="学院"
              name="colleges"
              class="w-full"
            >
              <USelectMenu
                v-model="state.colleges"
                multiple
                :items="collegeItems"
                value-key="id"
                class="w-full"
              />
            </UFormField>
          </UPageCard>
          <UPageCard variant="ghost">
            <UFormField
              label="入库时间"
              name="createAt"
              class="w-full"
            >
              <div class="flex items-center justify-between gap-2">
                <UInput
                  v-model="state.createAtStart"
                  type="date"
                  class="w-full"
                />
                <UInput
                  v-model="state.createAtEnd"
                  type="date"
                  class="w-full"
                />
              </div>
            </UFormField>
          </UPageCard>
        </div>
        <div class="w-full mt-4 px-6 flex justify-end gap-4">
          <UButton
            color="secondary"
            icon="i-tabler-refresh"
            @click="handleReset"
          >
            清空
          </UButton>
          <UButton
            color="info"
            icon="i-tabler-search"
            @click="handleSearch"
          >
            搜索
          </UButton>
        </div>
      </UForm>
    </BaseSection>
    <BaseSection
      title="成员列表"
      icon="i-tabler-table-heart"
    >
      {{ memberList }}
    </BaseSection>
  </UContainer>
</template>

<style scoped>

</style>
