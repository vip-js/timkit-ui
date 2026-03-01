<script lang="ts">
export const ToggleGroupContextKey = Symbol('ToggleGroupContext')
</script>

<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import * as toggleGroup from '@zag-js/toggle-group'
import { cva, type VariantProps } from '../../lib/cva'
import { cn } from '../../lib/utils'

const toggleGroupVariants = cva('flex items-center justify-center gap-1')

// Re-defining variants here or import from toggle if shared.
// Toggle variants are usually relevant for items.
// We'll accept them as props to pass down.

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    type?: 'single' | 'multiple'
    modelValue?: string | string[]
    value?: string | string[]
    defaultValue?: string | string[]
    disabled?: boolean
    id?: string
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
    id: props.id,
    multiple,
    disabled: props.disabled,
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onValueChange(details: { value: string[] }) {
      const nextValue = multiple ? details.value : details.value[0] || ''
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
  }
})

const service = useMachine(toggleGroup.machine, machineProps)
const api = computed(() => toggleGroup.connect(service, normalizeProps))

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
    :class="cn(toggleGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>
