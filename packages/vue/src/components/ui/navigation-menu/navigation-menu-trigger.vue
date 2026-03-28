<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { cn, navigationMenuTriggerIconVariants, navigationMenuTriggerStyle } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useNavigationMenuItemContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const item = useNavigationMenuItemContext()

const onClick = () => {
  if (!item) return
  item.setOpen(!item.open.value)
}

const onPointerEnter = () => {
  item?.setOpen(true)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!item) return
  if (event.key === 'Escape') {
    item.setOpen(false)
    return
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
    event.preventDefault()
    item.setOpen(true)
  }
}
</script>

<template>
  <button
    :id="item?.triggerId.value"
    :aria-controls="item?.contentId.value"
    :aria-expanded="item?.open.value ?? false"
    data-slot="navigation-menu-trigger"
    :data-state="item?.open.value ? 'open' : 'closed'"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class)"
    type="button"
    @click="onClick"
    @pointerenter="onPointerEnter"
    @keydown="onKeyDown"
  >
    <slot />
    <ChevronDownIcon
      :class="navigationMenuTriggerIconVariants()"
      aria-hidden="true"
    />
  </button>
</template>
