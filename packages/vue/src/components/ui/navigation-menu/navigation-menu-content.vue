<script setup lang="ts">
import { cn, navigationMenuContentVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useNavigationMenuItemContext } from './use-navigation-menu-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const item = useNavigationMenuItemContext()

const onKeyDown = (event: KeyboardEvent) => {
  if (!item || event.key !== 'Escape') return
  event.preventDefault()
  item.setOpen(false)
  const trigger = document.getElementById(item.triggerId.value)
  if (trigger instanceof HTMLElement) trigger.focus()
}
</script>

<template>
  <div
    v-if="item?.open.value"
    :id="item?.contentId.value"
    :aria-labelledby="item?.triggerId.value"
    role="region"
    data-slot="navigation-menu-content"
    data-state="open"
    @keydown="onKeyDown"
    :class="
      cn(
        navigationMenuContentVariants(),
        'absolute left-0 top-full mt-1 md:left-0 md:top-full',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
