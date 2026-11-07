<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import Presence from '../presence/presence.vue'
import { useDateRangePickerContext } from './use-date-range-picker-context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const context = useDateRangePickerContext()
const isOpen = computed(() => context?.value?.open ?? false)
const positionerProps = computed(() => context?.value?.getPositionerProps?.() ?? {})
const contentProps = computed(() => context?.value?.getContentProps?.() ?? {})
const contentClass = computed(() =>
  cn((contentProps.value as { class?: string }).class, props.class)
)

const onContentKey = (event: KeyboardEvent) => {
  const handler = (contentProps.value as { onKeydown?: (event: KeyboardEvent) => void }).onKeydown
  handler?.(event)
  if (event.key !== 'Escape') return
  const triggerId = (context?.value?.getTriggerProps?.() as { id?: string } | undefined)?.id
  context?.value?.setOpen?.(false)
  const trigger = typeof triggerId === 'string' ? document.getElementById(triggerId) : null
  if (trigger instanceof HTMLElement) trigger.focus()
}
</script>

<template>
  <Teleport to="body">
    <Presence :present="isOpen" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="date-range-picker-content"
        @keydown="onContentKey"
        :data-state="isOpen ? 'open' : 'closed'"
        :class="contentClass"
      >
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
