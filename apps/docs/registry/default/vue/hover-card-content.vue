<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes['class']; align?: 'center' | 'start' | 'end'; side?: 'top' | 'bottom' | 'left' | 'right'; sideOffset?: number }>(),
  {
    align: 'center',
    side: 'bottom',
    sideOffset: 4,
  }
)

const context = inject('hover-card') as { api: any } | null
const isOpen = computed(() => context?.api.open ?? false)
const positionerProps = computed(() => context?.api.getPositionerProps?.() ?? {})
const contentProps = computed(() => context?.api.getContentProps?.() ?? {})
const placement = computed(() =>
  props.align === 'center' ? props.side : `${props.side}-${props.align}`
)

watch(
  () => [placement.value, props.sideOffset],
  () => {
    context?.api.reposition?.({ placement: placement.value, gutter: props.sideOffset })
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="hover-card-content"
        data-state="open"
        :class="
          cn(
            'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class
          )
        "
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
