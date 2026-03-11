<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useNumberFieldContext } from './use-number-field-context'

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

const api = useNumberFieldContext()

const triggerProps = computed(() => ({
  ...(api.value?.getIncrementTriggerProps?.() ?? {}),
  type: props.asChild ? undefined : 'button',
  'data-slot': 'number-field-increment',
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
