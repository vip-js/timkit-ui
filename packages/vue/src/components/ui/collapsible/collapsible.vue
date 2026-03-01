<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { useCollapsible } from './use-collapsible'
import { provideCollapsibleContext } from './use-collapsible-context'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  id?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:open', 'change'])

const api = useCollapsible({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  disabled: props.disabled,
  onOpenChange(details: { open: boolean }) {
    emit('update:open', details.open)
    emit('change', details.open)
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
