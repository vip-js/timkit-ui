<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { hoverCardConnect, hoverCardMachine } from '@timui/core'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
  closeDelay?: number
  disabled?: boolean
  positioning?: {
    placement?: string
    gutter?: number
    offset?: number
  }
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

const service = useMachine(hoverCardMachine, machineProps)
const api = computed(() => hoverCardConnect(service, normalizeProps))

provide('hover-card', { api })
</script>

<template>
  <slot />
</template>
