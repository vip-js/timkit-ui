<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { usePassedProp } from '../../../hooks/passed-prop'
import { provideDropdownMenuRadioGroupContext } from './use-dropdown-menu-context'

const props = defineProps<{
  value?: string | null
  modelValue?: string | null
  defaultValue?: string
  onValueChange?: (value: string) => void
}>()
const emit = defineEmits(['update:value', 'update:modelValue', 'change'])
const attrs = useAttrs()
const passed = usePassedProp()
const uncontrolled = ref(props.defaultValue ?? '')

provideDropdownMenuRadioGroupContext(
  computed(() => {
    const valueProp = passed<string | null>(props, 'value')
    const modelProp = passed<string | null>(props, 'modelValue')
    const controlled = valueProp !== undefined ? valueProp : modelProp
    return {
      value: controlled !== undefined ? controlled : uncontrolled.value,
      onValueChange(nextValue: string) {
        if (controlled === undefined) uncontrolled.value = nextValue
        props.onValueChange?.(nextValue)
        emit('update:value', nextValue)
        emit('update:modelValue', nextValue)
        emit('change', nextValue)
      },
    }
  })
)
</script>

<template>
  <div v-bind="attrs" data-slot="dropdown-menu-radio-group">
    <slot />
  </div>
</template>
