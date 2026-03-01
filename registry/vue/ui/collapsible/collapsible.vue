<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import * as collapsible from '@zag-js/collapsible'
import { cva } from '../../lib/cva'
import { cn } from '../../lib/utils'

const collapsibleRootVariants = cva('')

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

const service = useMachine(collapsible.machine, machineProps)
const api = computed(() => collapsible.connect(service, normalizeProps))

provide('collapsible', api)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="collapsible"
    :class="cn(collapsibleRootVariants(), props.class)"
  >
    <slot />
  </div>
</template>
