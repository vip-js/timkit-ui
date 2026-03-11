<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'
import { useListBoxContext } from '../list-box/use-list-box-context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  id: string
  isDisabled?: boolean
  class?: HTMLAttributes['class']
}>()

const context = useListBoxContext()
const elRef = ref<HTMLElement | null>(null)

const isDisabled = computed(() => props.isDisabled ?? false)
const isSelected = computed(() => context.isSelected(props.id))
const isActive = computed(() => context.activeId.value === props.id)

const tabIndex = computed(() => {
  if (isDisabled.value) return -1
  return isActive.value ? 0 : -1
})

const handleClick = () => {
  if (isDisabled.value) return
  context.setActive(props.id)
  context.selectItem(props.id)
  context.focusItem(props.id)
}

const handleFocus = () => {
  if (isDisabled.value) return
  context.setActive(props.id)
}

onMounted(() => {
  context.registerItem(props.id, elRef.value, isDisabled.value)
})

onBeforeUnmount(() => {
  context.unregisterItem(props.id)
})

watch(
  () => isDisabled.value,
  (next) => {
    context.setItemDisabled(props.id, next)
  }
)
</script>

<template>
  <div
    ref="elRef"
    :id="props.id"
    role="option"
    data-slot="list-box-item"
    :data-selected="isSelected ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :aria-selected="isSelected || undefined"
    :aria-disabled="isDisabled || undefined"
    :tabindex="tabIndex"
    :class="cn(props.class)"
    @click="handleClick"
    @focus="handleFocus"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
