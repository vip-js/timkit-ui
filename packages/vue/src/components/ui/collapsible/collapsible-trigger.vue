<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useCollapsibleContext } from './use-collapsible-context'

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

const api = useCollapsibleContext()
const triggerProps = computed(() => api.value.getTriggerProps())
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
