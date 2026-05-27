<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useDialogContext } from './use-dialog-context'

const props = withDefaults(
  defineProps<{
    as?: string | Component
    asChild?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'button',
  }
)

const api = useDialogContext()
const closeProps = computed(() => ({
  ...(api.value.getCloseTriggerProps?.() ?? {}),
  type: props.asChild ? undefined : 'button',
  'data-slot': 'dialog-close',
}))
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="closeProps"
  >
    <slot />
  </Primitive>
</template>
