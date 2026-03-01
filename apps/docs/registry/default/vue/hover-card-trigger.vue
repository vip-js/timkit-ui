<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from './primitive'

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

const context = inject('hover-card') as { api: any } | null
const triggerProps = computed(() => ({
  ...(context?.api.getTriggerProps?.() ?? {}),
  'data-slot': 'hover-card-trigger',
}))
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" v-bind="triggerProps" :class="cn(props.class)">
    <slot />
  </Primitive>
</template>
