<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { cn, navigationMenuTriggerIconVariants, navigationMenuTriggerStyle } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'

import { useNavigationMenuItemContext, useNavigationMenuRootContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class']; disabled?: boolean }>()
const item = useNavigationMenuItemContext()
const root = useNavigationMenuRootContext()
const locked = computed(() => props.disabled === true || root?.disabled.value === true)

const onClick = () => {
  if (!item || locked.value) return
  item.setOpen(!item.open.value)
}

const onPointerEnter = () => {
  if (locked.value) return
  item?.setOpen(true)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!item || locked.value) return
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
    :disabled="locked"
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
