<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { useCollapsible } from './use-collapsible'
import { provideCollapsibleContext } from './use-collapsible-context'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  id?: string
  onOpenChange?: (open: boolean) => void
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:open', 'change'])

const api = useCollapsible({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  disabled: props.disabled,
  onOpenChange(open: boolean) {
    props.onOpenChange?.(open)
    emit('update:open', open)
    emit('change', open)
  },
})

provideCollapsibleContext(api)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    :class="props.class"
  >
    <slot />
  </div>
</template>
