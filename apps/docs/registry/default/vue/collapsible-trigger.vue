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
    as: 'button',
  },
)

const context = inject('collapsible') as { api: any } | null
const triggerProps = computed(() => context?.api.getTriggerProps?.() ?? {})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="triggerProps"
    data-slot="collapsible-trigger"
    type="button"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
