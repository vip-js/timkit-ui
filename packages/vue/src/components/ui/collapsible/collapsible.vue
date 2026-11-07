<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { useCollapsible } from './use-collapsible'
import { provideCollapsibleContext } from './use-collapsible-context'

const props = defineProps<{
  open?: boolean | null
  defaultOpen?: boolean
  disabled?: boolean
  id?: string
  onOpenChange?: (open: boolean) => void
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:open', 'change'])

const api = useCollapsible(props, emit)

provideCollapsibleContext(api)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    :class="props.class"
  >
    <p v-if="api.open" role="status">Opened</p>
    <slot />
  </div>
</template>
