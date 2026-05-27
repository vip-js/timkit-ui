<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { usePopoverContext } from './use-popover-context'

const props = withDefaults(
  defineProps<{
    as?: string | Component
    asChild?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'div',
  }
)

const context = usePopoverContext()
const anchorProps = computed(() => ({
  ...(context.value.getAnchorProps?.() ?? {}),
  'data-slot': 'popover-anchor',
}))
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="anchorProps"
  >
    <slot />
  </Primitive>
</template>
