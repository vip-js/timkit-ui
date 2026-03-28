<script setup lang="ts">
import { computed, watch } from 'vue'
import { cn, hoverCardContentVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'
import type { Placement } from '@zag-js/popper'
import { useHoverCardContext } from './use-hover-card-context'
import Presence from '../presence/presence.vue'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    align?: 'center' | 'start' | 'end'
    side?: 'top' | 'bottom' | 'left' | 'right'
    sideOffset?: number
    showArrow?: boolean
  }>(),
  {
    align: 'center',
    side: 'bottom',
    sideOffset: 4,
    showArrow: false,
  }
)

const context = useHoverCardContext()
const isOpen = computed(() => context.value.open ?? false)
const positionerProps = computed(() => context.value.getPositionerProps?.() ?? {})
const contentProps = computed(() => context.value.getContentProps?.() ?? {})
const placement = computed(() =>
  props.align === 'center' ? props.side : `${props.side}-${props.align}`
)

watch(
  () => [placement.value, props.sideOffset],
  () => {
    context.value.reposition?.({ placement: placement.value as Placement, gutter: props.sideOffset })
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <Presence :present="isOpen" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="hover-card-content"
        data-state="open"
        :class="
          cn(hoverCardContentVariants(), props.showArrow && 'relative', props.class)
        "
      >
        <slot />
        <span
          v-if="props.showArrow"
          data-slot="hover-card-arrow"
          class="absolute -top-1 left-6 h-2 w-2 rotate-45 border border-border bg-popover"
        />
      </div>
    </Presence>
  </Teleport>
</template>
