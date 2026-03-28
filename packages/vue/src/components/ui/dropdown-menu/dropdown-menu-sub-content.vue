<script setup lang="ts">
import { cn, dropdownMenuSubContentVariants } from '@timui/core'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes, CSSProperties } from 'vue'

import { useDropdownMenuSubContext } from './use-dropdown-menu-sub-context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const subContext = useDropdownMenuSubContext()
const contentRef = ref<HTMLElement | null>(null)
const contentStyle = ref<CSSProperties>({
  position: 'fixed',
  top: '0px',
  left: '0px',
  zIndex: 60,
})

const updatePosition = () => {
  if (!subContext?.triggerElement.value || !contentRef.value) return

  const triggerRect = subContext.triggerElement.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const gap = 6
  const viewportPadding = 8

  let left = triggerRect.right + gap
  if (left + contentRect.width > window.innerWidth - viewportPadding) {
    left = triggerRect.left - contentRect.width - gap
  }

  let top = triggerRect.top
  if (top + contentRect.height > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, window.innerHeight - contentRect.height - viewportPadding)
  }

  contentStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 60,
  }
}

const scheduleUpdate = () => {
  requestAnimationFrame(() => updatePosition())
}

watch(
  () => subContext?.open.value ?? false,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    updatePosition()
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate, true)
})

const onPointerEnter = () => {
  subContext?.setOpen(true)
}

const onPointerLeave = () => {
  subContext?.setOpen(false)
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!subContext) return
  if (event.key === 'Escape' || event.key === 'ArrowLeft') {
    subContext.setOpen(false)
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="subContext?.open.value"
      ref="contentRef"
      data-slot="dropdown-menu-sub-content"
      data-state="open"
      :style="contentStyle"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @keydown="onKeyDown"
      :class="
        cn(
          dropdownMenuSubContentVariants(),
          props.class
        )
      "
    >
      <slot />
    </div>
  </Teleport>
</template>
