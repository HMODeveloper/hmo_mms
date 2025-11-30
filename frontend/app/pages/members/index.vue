<script setup lang="ts">
import type { MemberInfo } from "~/apis/member"

definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})

const memberList = ref<MemberInfo[]>([])
</script>

<template>
  <UContainer class="mt-4 py-2">
    <MembersSearch
      v-model="memberList"
    />
    {{ memberList }}
  </UContainer>
</template>

<style scoped>

</style>
