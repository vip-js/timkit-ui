<script setup lang="ts">
import { computed, mergeProps, ref, useAttrs, useId } from 'vue'
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
const generatedId = useId()
const registeredItems = ref<ListBoxItem[]>([])

const normalizeValue = (value?: ListBoxValue) => {
  if (value === undefined || value === null) return undefined
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
const controlledValue = computed<ListBoxValue>(() => props.modelValue ?? props.value)

const machineProps = computed(() => ({
  id: props.id ?? generatedId,
  collection: collection.value,
  multiple: selectionMode.value === 'multiple',
  value: controlledValue.value !== undefined ? normalizeValue(controlledValue.value) : undefined,
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
const api = computed(() => listBoxConnect(service, normalizeProps))
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
  registerItem,
  unregisterItem,
})
</script>

<template>
  <div v-bind="rootProps">
    <div
      v-bind="mergedList.props"
      data-slot="list-box"
      :class="cn(listBoxListVariants(), props.class, mergedList.class)"
    >
      <slot />
    </div>
  </div>
</template>
