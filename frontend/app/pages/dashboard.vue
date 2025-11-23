<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  requiresAuth: true,
})
</script>

<template>
  <UPageSection>
    <UButton
      label="回到主页"
      to="/"
    />
  </UPageSection>
</template>

<style scoped>

</style>
