<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import type { PositioningOptions } from '@zag-js/popper'
import { useHoverCard } from './use-hover-card'
import { HoverCardProvider } from './use-hover-card-context'

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

const api = useHoverCard(props, emit)
HoverCardProvider(api)
</script>

<template>
  <slot />
</template>
