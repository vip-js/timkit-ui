<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { cn } from '@timui/core'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  id?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:open', 'change'])

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  disabled: props.disabled,
  onOpenChange(details: { open: boolean }) {
    emit('update:open', details.open)
    emit('change', details.open)
  },
}))

const service = useMachine(collapsibleMachine, machineProps)
const api = computed(() => collapsibleConnect(service, normalizeProps))

provide('collapsible', { api })
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="collapsible"
    :data-state="api.open ? 'open' : 'closed'"
    :class="cn(props.class)"
  >
    <slot />
  </div>
</template>
