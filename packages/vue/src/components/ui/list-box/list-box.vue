<script setup lang="ts">
import { computed, mergeProps, ref, useAttrs, useId, watchEffect } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  cn,
  listBoxCollection,
  listBoxConnect,
  listBoxListVariants,
  listBoxMachine,
  type ListBoxItem,
  type ListBoxVueProps,
  type ListBoxValue,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'

import { ListBoxProvider } from './use-list-box-context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    ListBoxVueProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    selectionMode: 'single',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value?: ListBoxValue): void
  (e: 'change', value?: ListBoxValue): void
}>()

const attrs = useAttrs()
const listLabel = computed(() => {
  const label = attrs['aria-label']
  return typeof label === 'string' && label ? label : 'List'
})
const generatedId = useId()
const registeredItems = ref<ListBoxItem[]>([])

const normalizeValue = (value?: ListBoxValue | null) => {
  if (value === undefined) return undefined
  if (value === null) return []
  if (Array.isArray(value)) return value.map((item) => String(item))
  return [String(value)]
}

const registerItem = (item: ListBoxItem) => {
  const index = registeredItems.value.findIndex((existing) => existing.value === item.value)
  if (index === -1) {
    registeredItems.value = [...registeredItems.value, item]
    return
  }
  const prev = registeredItems.value[index]
  if (prev.label === item.label && prev.disabled === item.disabled) return
  const next = [...registeredItems.value]
  next[index] = item
  registeredItems.value = next
}

const unregisterItem = (value: string) => {
  if (!registeredItems.value.some((item) => item.value === value)) return
  registeredItems.value = registeredItems.value.filter((item) => item.value !== value)
}

const collection = computed(() =>
  listBoxCollection<ListBoxItem>({
    items: registeredItems.value,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })
)

const selectionMode = computed(() => props.selectionMode ?? 'single')
const controlledValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : props.value
)

const machineProps = computed(() => ({
  id: props.id ?? generatedId,
  collection: collection.value,
  multiple: selectionMode.value === 'multiple',
  value:
    controlledValue.value !== undefined ? (normalizeValue(controlledValue.value) ?? []) : undefined,
  defaultValue:
    controlledValue.value === undefined ? normalizeValue(props.defaultValue) : undefined,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  open: true,
  defaultOpen: true,
  closeOnSelect: false,
  onValueChange(details: { value: string[] }) {
    const nextValue = selectionMode.value === 'multiple' ? details.value : details.value[0]
    props.onValueChange?.(nextValue)
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
}))

const service = useMachine(listBoxMachine, machineProps)
const phase = ref('')
watchEffect(() => {
  const value = service.context.get('value')
  const highlighted = service.context.get('highlightedValue')
  phase.value = `${Array.isArray(value) ? value.join('|') : ''}:${highlighted ?? ''}`
})
const api = computed(() => {
  phase.value
  registeredItems.value
  return listBoxConnect(service, normalizeProps)
})
const highlightedValue = ref('')
const onListKey = (event: KeyboardEvent) => {
  if (props.disabled || event.defaultPrevented) return
  const items = (
    (api.value.collection as { items?: Array<{ value?: string; label?: string; disabled?: boolean }> }).items ?? []
  ).filter((item) => item.value && !item.disabled)
  if (!items.length) return
  const current = items.findIndex((item) => item.value === api.value.highlightedValue)
  const highlight = (value?: string) => {
    if (!value) return
    event.preventDefault()
    highlightedValue.value = value
    api.value.setHighlightValue(value)
  }
  if (event.key === 'Home' || event.key === 'End') {
    highlight(items[event.key === 'Home' ? 0 : items.length - 1]?.value)
    return
  }
  if (/^[a-z]$/i.test(event.key)) {
    const letter = event.key.toLowerCase()
    for (let step = 1; step <= items.length; step += 1) {
      const next = items[(current + step) % items.length]
      const name = String(next?.label || next?.value || '').trim().toLowerCase()
      if (!name.startsWith(letter)) continue
      highlight(next?.value)
      return
    }
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const start = current < 0 ? (event.key === 'ArrowDown' ? -1 : 0) : current
    const delta = event.key === 'ArrowDown' ? 1 : -1
    const next = items[(start + delta + items.length) % items.length]
    highlightedValue.value = next.value ?? ''
    api.value.setHighlightValue(highlightedValue.value)
    return
  }
  if (event.key !== 'Enter' && event.key !== ' ') return
  const item = items[current]
  if (!item?.value) return
  event.preventDefault()
  api.value.selectValue(item.value)
}
const rootProps = computed(() => api.value.getRootProps())
type MergedProps = Record<string, unknown> & { class?: HTMLAttributes['class'] }
const mergedList = computed(() => {
  const merged = mergeProps(api.value.getListProps() as MergedProps, attrs as MergedProps) as MergedProps
  const mergedClass = merged.class as HTMLAttributes['class']
  const { class: _class, ...restProps } = merged
  return { class: mergedClass, props: restProps as Record<string, unknown> }
})

ListBoxProvider({
  api,
  highlightedValue,
  registerItem,
  unregisterItem,
})
</script>

<template>
  <div v-bind="rootProps">
    <div
      v-bind="mergedList.props"
      data-slot="list-box"
      :aria-label="listLabel"
      @keydown="onListKey"
      :class="cn(listBoxListVariants(), props.class, mergedList.class)"
    >
      <slot />
    </div>
  </div>
</template>
