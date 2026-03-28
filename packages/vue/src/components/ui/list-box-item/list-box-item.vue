<script setup lang="ts">
import { computed, mergeProps, onBeforeUnmount, useAttrs, useId, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn, listBoxItemVariants, type ListBoxItem } from '@timui/core'

import { useListBoxContext } from '../list-box/use-list-box-context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  id?: string
  value?: string
  isDisabled?: boolean
  textValue?: string
  class?: HTMLAttributes['class']
}>()

const attrs = useAttrs()
const generatedId = useId()
const context = useListBoxContext()

const item = computed<ListBoxItem>(() => {
  const value = props.value ?? props.id ?? generatedId
  return {
    value,
    label: props.textValue ?? value,
    disabled: props.isDisabled,
  }
})

watch(
  item,
  (next, prev) => {
    if (prev && prev.value !== next.value) {
      context.unregisterItem(prev.value)
    }
    context.registerItem(next)
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  context.unregisterItem(item.value.value)
})

const itemState = computed(() => context.api.value.getItemState({ item: item.value }))
type MergedProps = Record<string, unknown> & { class?: HTMLAttributes['class'] }
const mergedItem = computed(() => {
  const merged = mergeProps(
    context.api.value.getItemProps({ item: item.value }) as MergedProps,
    attrs as MergedProps
  ) as MergedProps
  const mergedClass = merged.class as HTMLAttributes['class']
  const { class: _class, ...restProps } = merged
  return { class: mergedClass, props: restProps as Record<string, unknown> }
})
</script>

<template>
  <div
    v-bind="mergedItem.props"
    data-slot="list-box-item"
    :data-selected="itemState.selected ? 'true' : undefined"
    :class="cn(listBoxItemVariants(), props.class, mergedItem.class)"
  >
    <slot />
  </div>
</template>
