<script setup lang="ts">
import { departmentList } from "~/apis/department"

function handleClick() {
  departmentList()
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<template>
  <UPageSection>
    仪表盘
    <UButton label="测试按钮" @click="handleClick" />
  </UPageSection>
</template>

<style scoped>

</style>
