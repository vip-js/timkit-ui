<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useDateRangePickerContext } from './use-date-range-picker-context'

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

const context = useDateRangePickerContext()

const triggerProps = computed(() => ({
  ...(context?.value?.getTriggerProps?.() ?? {}),
  type: props.asChild ? undefined : 'button',
  'data-slot': 'date-range-picker-trigger',
}))
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="triggerProps"
  >
    <slot />
  </Primitive>
</template>
