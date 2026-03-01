<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { PositioningOptions } from '@zag-js/popper'
import * as hoverCard from '@zag-js/hover-card'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
  closeDelay?: number
  disabled?: boolean
  positioning?: PositioningOptions
  id?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:open', 'change'])

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  disabled: props.disabled,
  positioning: props.positioning,
  onOpenChange(details: { open: boolean }) {
    emit('update:open', details.open)
    emit('change', details.open)
  },
}))

const service = useMachine(hoverCard.machine, machineProps as any)
const api = computed(() => hoverCard.connect(service, normalizeProps))

provide('hover-card', api)
</script>

<template>
  <slot />
</template>
