<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { ListBoxProvider, type ListBoxSelectionMode } from './use-list-box-context'

defineOptions({
  inheritAttrs: false,
})

type ListBoxValue = string | string[] | undefined

const props = withDefaults(
  defineProps<{
    selectionMode?: ListBoxSelectionMode
    modelValue?: ListBoxValue
    defaultValue?: ListBoxValue
    class?: HTMLAttributes['class']
  }>(),
  {
    selectionMode: 'single',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value?: ListBoxValue): void
  (e: 'change', value?: ListBoxValue): void
}>()

const selectionMode = computed(() => props.selectionMode)
const selectedIds = ref<Set<string>>(new Set())
const activeId = ref<string | null>(null)
const itemOrder = ref<string[]>([])
const itemRefs = new Map<string, HTMLElement>()
const itemDisabled = new Map<string, boolean>()

const normalizeValue = (value?: ListBoxValue) => {
  if (value === undefined || value === null) return new Set<string>()
  if (Array.isArray(value)) return new Set(value)
  return new Set([value])
}

const emitSelection = (next: Set<string>) => {
  selectedIds.value = next
  if (selectionMode.value === 'multiple') {
    const values = Array.from(next)
    emit('update:modelValue', values)
    emit('change', values)
  } else {
    const value = Array.from(next)[0]
    emit('update:modelValue', value)
    emit('change', value)
  }
}

watch(
  () => props.modelValue,
  (next) => {
    if (next !== undefined) {
      selectedIds.value = normalizeValue(next)
    }
  },
  { immediate: true }
)

const registerItem = (id: string, el: HTMLElement | null, disabled: boolean) => {
  if (!itemOrder.value.includes(id)) {
    itemOrder.value.push(id)
  }
  if (el) itemRefs.set(id, el)
  itemDisabled.set(id, disabled)
  if (!activeId.value && !disabled) {
    activeId.value = id
  }
}

const unregisterItem = (id: string) => {
  itemOrder.value = itemOrder.value.filter((item) => item !== id)
  itemRefs.delete(id)
  itemDisabled.delete(id)
  if (activeId.value === id) {
    const next = itemOrder.value.find((item) => !itemDisabled.get(item))
    activeId.value = next ?? null
  }
}

const setItemDisabled = (id: string, disabled: boolean) => {
  itemDisabled.set(id, disabled)
  if (disabled && activeId.value === id) {
    const next = itemOrder.value.find((item) => !itemDisabled.get(item))
    activeId.value = next ?? null
  }
}

const setActive = (id: string) => {
  if (itemDisabled.get(id)) return
  activeId.value = id
}

const isSelected = (id: string) => selectedIds.value.has(id)
const isDisabled = (id: string) => itemDisabled.get(id) ?? false

const selectItem = (id: string) => {
  if (isDisabled(id)) return
  const next = new Set(selectedIds.value)
  if (selectionMode.value === 'multiple') {
    if (next.has(id)) next.delete(id)
    else next.add(id)
  } else {
    next.clear()
    next.add(id)
  }
  emitSelection(next)
}

const focusItem = (id: string) => {
  const el = itemRefs.get(id)
  if (el) el.focus()
}

const moveActive = (delta: number) => {
  if (!itemOrder.value.length) return
  const currentIndex = activeId.value
    ? itemOrder.value.indexOf(activeId.value)
    : -1
  let index = currentIndex
  for (let i = 0; i < itemOrder.value.length; i += 1) {
    index = (index + delta + itemOrder.value.length) % itemOrder.value.length
    const id = itemOrder.value[index]
    if (!isDisabled(id)) {
      activeId.value = id
      focusItem(id)
      return
    }
  }
}

const onKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      break
    case 'Home':
      event.preventDefault()
      moveActive(-itemOrder.value.length)
      break
    case 'End':
      event.preventDefault()
      moveActive(itemOrder.value.length)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (activeId.value) selectItem(activeId.value)
      break
    default:
      break
  }
}

const onFocus = () => {
  if (activeId.value) focusItem(activeId.value)
}

onMounted(() => {
  if (props.modelValue === undefined && props.defaultValue !== undefined) {
    selectedIds.value = normalizeValue(props.defaultValue)
  }
})

ListBoxProvider({
  selectionMode,
  selectedIds,
  activeId,
  registerItem,
  unregisterItem,
  setItemDisabled,
  setActive,
  isSelected,
  isDisabled,
  selectItem,
  focusItem,
})
</script>

<template>
  <div
    role="listbox"
    data-slot="list-box"
    tabindex="0"
    :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
    :class="cn(props.class)"
    @keydown="onKeydown"
    @focus="onFocus"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
