<script setup lang="ts">
import { cn, dropdownMenuSubTriggerVariants } from '@timui/core'
import { ChevronRightIcon } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import type { HTMLAttributes } from 'vue'

import { useDropdownMenuSubContext } from './use-dropdown-menu-sub-context'

const props = defineProps<{ class?: HTMLAttributes['class']; inset?: boolean }>()
const subContext = useDropdownMenuSubContext()
const triggerRef = ref<HTMLElement | null>(null)

watchEffect(() => {
  if (!subContext) return
  subContext.triggerElement.value = triggerRef.value
})

const onPointerEnter = () => {
  subContext?.setOpen(true)
}

const onClick = () => {
  if (!subContext) return
  subContext.setOpen(!subContext.open.value)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!subContext) return
  if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    subContext.setOpen(true)
  }
  if (event.key === 'ArrowLeft' || event.key === 'Escape') {
    subContext.setOpen(false)
  }
}
</script>

<template>
  <div
    ref="triggerRef"
    data-slot="dropdown-menu-sub-trigger"
    role="menuitem"
    tabindex="-1"
    aria-haspopup="menu"
    :aria-expanded="subContext?.open.value ?? false"
    :data-state="subContext?.open.value ? 'open' : 'closed'"
    @pointerenter="onPointerEnter"
    @click="onClick"
    @keydown="onKeyDown"
    :class="
      cn(
        dropdownMenuSubTriggerVariants(),
        props.inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
    <ChevronRightIcon aria-hidden="true" class="ml-auto h-4 w-4" />
  </div>
</template>
