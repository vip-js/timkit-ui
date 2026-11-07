<script lang="ts">
import { type ToggleVariants } from '@timui/core'
</script>

<script setup lang="ts">
import { cn, toggleGroupVariants } from '@timui/core'
import { computed, ref, useAttrs, type HTMLAttributes } from 'vue'
import { provideToggleGroupContext, type ToggleGroupContextValue } from './use-toggle-group-context'
import { useToggleGroup } from './use-toggle-group'

const props = withDefaults(
  defineProps<{
    id?: string
    class?: HTMLAttributes['class']
    variant?: ToggleGroupContextValue['variant']
    size?: ToggleGroupContextValue['size']
    type?: 'single' | 'multiple'
    modelValue?: string | string[] | null
    value?: string | string[] | null
    defaultValue?: string | string[]
    disabled?: boolean
    loop?: boolean
  }>(),
  {
    type: 'single',
    variant: 'default',
    size: 'default',
  },
)

const emit = defineEmits(['update:modelValue', 'change'])

const attrs = useAttrs()
const groupLabel = computed(() => {
  const label = attrs['aria-label']
  return typeof label === 'string' && label ? label : 'Toggle group'
})
const api = useToggleGroup(props, emit)
const items = ref<string[]>([])
const register = (value: string) => {
  if (value) items.value = [...items.value, value]
  return () => {
    const index = items.value.indexOf(value)
    if (index >= 0) items.value = items.value.filter((_, itemIndex) => itemIndex !== index)
  }
}
const itemStatus = computed(() => {
  const raw = api.value.value as string | string[] | undefined
  const selected = Array.isArray(raw) ? raw.filter(Boolean) : raw ? [String(raw)] : []
  if (selected.length === 0) return ''
  if (selected.length === 1) {
    const index = items.value.indexOf(selected[0] ?? '')
    return index < 0 ? '' : `Item ${index + 1} of ${items.value.length}`
  }
  return `${selected.length} items pressed`
})

provideToggleGroupContext({
  variant: props.variant,
  size: props.size,
  api,
  type: props.type,
  disabled: props.disabled,
  register,
})
</script>

<template>
  <p v-if="itemStatus" role="status">{{ itemStatus }}</p>
  <div
    v-bind="api.getRootProps()"
    data-slot="toggle-group"
    :aria-label="groupLabel"
    :class="cn(toggleGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>
