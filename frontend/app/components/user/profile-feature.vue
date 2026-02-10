<script setup lang="ts">
interface Props {
  label: string
  icon: string
  modelValue: string | number | null | undefined
  type?: string
  editing?: boolean
}

withDefaults(defineProps<Props>(), {
  type: "text",
  editing: false,
})
defineEmits(["update:modelValue"])
</script>

<template>
  <UPageFeature :title="label" :icon="icon">
    <template #description>
      <UInput
        class="-ml-2"
        :value="modelValue ?? (editing ? '' : '---')"
        :variant="editing ? 'outline' : 'ghost'"
        :disabled="!editing"
        :type="type"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </template>
  </UPageFeature>
</template>

<style scoped>

</style>
