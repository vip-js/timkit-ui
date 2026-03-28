<script setup lang="ts">
import { cn, navigationMenuItemVariants } from '@timui/core'
import { computed, ref, useId, type HTMLAttributes } from 'vue'

import {
  provideNavigationMenuItemContext,
  useNavigationMenuRootContext,
} from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const root = useNavigationMenuRootContext()
const itemRef = ref<HTMLElement | null>(null)
const value = ref(useId())
const triggerId = ref(`nav-trigger-${useId()}`)
const contentId = ref(`nav-content-${useId()}`)
const open = computed(() => root?.openItem.value === value.value)

const setOpen = (nextOpen: boolean) => {
  root?.setOpenItem(nextOpen ? value.value : null)
}

const onFocusOut = (event: FocusEvent) => {
  const related = event.relatedTarget
  if (!(related instanceof Node)) {
    setOpen(false)
    return
  }
  if (!itemRef.value?.contains(related)) {
    setOpen(false)
  }
}

const onMouseLeave = () => {
  setOpen(false)
}

provideNavigationMenuItemContext({
  value,
  triggerId,
  contentId,
  open,
  setOpen,
})
</script>

<template>
  <li
    ref="itemRef"
    data-slot="navigation-menu-item"
    :data-state="open ? 'open' : 'closed'"
    :class="cn(navigationMenuItemVariants(), props.class)"
    @focusout="onFocusOut"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </li>
</template>
