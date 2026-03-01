<script lang="ts">
import { type ToggleVariants } from '@timui/core'
</script>

<script setup lang="ts">
import { cn, toggleGroupVariants } from '@timui/core'
import { computed, type HTMLAttributes } from 'vue'
import { provideToggleGroupContext, type ToggleGroupContextValue } from './use-toggle-group-context'
import { useToggleGroup } from './use-toggle-group'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: ToggleGroupContextValue['variant']
    size?: ToggleGroupContextValue['size']
    type?: 'single' | 'multiple'
    modelValue?: string | string[]
    value?: string | string[]
    defaultValue?: string | string[]
    disabled?: boolean
  }>(),
  {
    type: 'single',
    variant: 'default',
    size: 'default',
  },
)

const emit = defineEmits(['update:modelValue', 'change'])

const toArray = (value?: string | string[] | null) => {
  if (value == null) return undefined
  return Array.isArray(value) ? value : value === '' ? [] : [value]
}

const api = useToggleGroup({
  multiple: props.type === 'multiple',
  disabled: props.disabled,
  value: toArray(props.value ?? props.modelValue),
  defaultValue: toArray(props.value ?? props.modelValue) === undefined ? toArray(props.defaultValue) : undefined,
  onValueChange(details: { value: string[] }) {
    const nextValue = props.type === 'multiple' ? details.value : details.value[0] || ''
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

provideToggleGroupContext({
  variant: props.variant,
  size: props.size,
  api,
  type: props.type,
  disabled: props.disabled,
})
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="toggle-group"
    :class="cn(toggleGroupVariants(), props.class)"
    role="group"
  >
    <slot />
  </div>
</template>
