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
    as: 'div',
  }
)

const api = useNumberFieldContext()

const controlProps = computed(() => ({
  ...(api.value?.getControlProps?.() ?? {}),
  'data-slot': 'number-field-control',
}))
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="controlProps"
  >
    <slot />
  </Primitive>
</template>
