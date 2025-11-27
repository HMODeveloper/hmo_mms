<script setup lang="ts">
import { type MemberInfo, memberSearchAPI } from "~/apis/member"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const memberList = ref<MemberInfo[]>([])

onMounted(async () => {
  memberList.value = (await memberSearchAPI({})).data.members
})
</script>

<template>
  <UContainer class="mt-4 py-2">
    <BaseSection
      title="成员搜索"
      icon="i-tabler-search"
    >
      {{ memberList }}
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
