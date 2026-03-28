<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { provideDropdownMenuRadioGroupContext } from './use-dropdown-menu-context'

const props = defineProps<{
  value?: string
  modelValue?: string
  onValueChange?: (value: string) => void
}>()
const emit = defineEmits(['update:value', 'update:modelValue', 'change'])
const attrs = useAttrs()

provideDropdownMenuRadioGroupContext(
  computed(() => ({
    value: props.value ?? props.modelValue,
    onValueChange(nextValue: string) {
      props.onValueChange?.(nextValue)
      emit('update:value', nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
  }))
)
</script>

<template>
  <div v-bind="attrs" data-slot="dropdown-menu-radio-group">
    <slot />
  </div>
</template>
