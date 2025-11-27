<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="w-full mt-4">
    <p class="py-2 text-2xl font-bold text-left">
      <slot name="title">
        <span class="flex items-center gap-2">
          <UIcon
            v-if="icon"
            :name="icon"
            class="text-primary"
          />
          {{ title }}
        </span>
      </slot>
    </p>
    <USeparator
      color="primary"
      type="solid"
      size="md"
    />
    <slot />
  </div>
</template>

<style scoped>

</style>
