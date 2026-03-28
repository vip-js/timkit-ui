<script lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { type ToggleVariants } from './toggle.vue' 

export type ToggleGroupContextValue = {
  variant: ToggleVariants['variant']
  size: ToggleVariants['size']
  api: import('vue').ComputedRef<any>
  type: 'single' | 'multiple'
  disabled?: boolean
}

export const ToggleGroupContextKey = Symbol('ToggleGroupContext')
</script>

<script setup lang="ts">
import { cn } from '@timui/core'
import { provide, computed, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { toggleGroupConnect, toggleGroupMachine } from '@timui/core'

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

const machineProps = computed(() => {
  const multiple = props.type === 'multiple'
  const value = toArray(props.value ?? props.modelValue)
  const defaultValue = toArray(props.defaultValue)
  return {
    multiple,
    disabled: props.disabled,
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onValueChange(value: string[]) {
      const nextValue = multiple ? value : value[0] || ''
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
  }
})

const service = useMachine(toggleGroupMachine, machineProps)
const api = computed(() => toggleGroupConnect(service, normalizeProps))

provide(ToggleGroupContextKey, {
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
    :class="cn('flex items-center justify-center gap-1', props.class)"
    role="group"
  >
    <slot />
  </div>
</template>
