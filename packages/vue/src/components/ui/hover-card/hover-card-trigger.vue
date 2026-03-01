<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useHoverCardContext } from './use-hover-card-context'

const props = withDefaults(
  defineProps<{
    as?: string | Component
    asChild?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'a',
  }
)

const context = useHoverCardContext()
const triggerProps = computed(() => ({
  ...(context.value.getTriggerProps?.() ?? {}),
  'data-slot': 'hover-card-trigger',
}))
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" v-bind="triggerProps" :class="cn(props.class)">
    <slot />
  </Primitive>
</template>
