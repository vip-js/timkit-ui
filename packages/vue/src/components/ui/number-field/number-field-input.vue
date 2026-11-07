<script setup lang="ts">
import { computed, useAttrs, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@timui/core'
import { Primitive } from '../../primitive'
import { useNumberFieldContext } from './use-number-field-context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    as?: string | Component
    asChild?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'input',
  }
)

const api = useNumberFieldContext()
const attrs = useAttrs()

const inputProps = computed(() => {
  const machine = api.value?.getInputProps?.() ?? {}
  const { onKeydown, onKeyDown, ...rest } = machine as Record<string, unknown>
  const previous = (onKeydown ?? onKeyDown) as ((event: KeyboardEvent) => void) | undefined
  const named = Boolean(
    attrs['aria-label'] || attrs['aria-labelledby'] || machine['aria-label'] || machine['aria-labelledby']
  )
  return {
    ...rest,
    ...attrs,
    'data-slot': 'number-field-input',
    ...(named ? {} : { 'aria-label': 'Number' }),
    onKeydown(event: KeyboardEvent) {
      previous?.(event)
      const input = event.currentTarget
      if (!(input instanceof HTMLInputElement)) return
      if (event.defaultPrevented || input.disabled || input.readOnly) return
      if (event.key !== 'PageUp' && event.key !== 'PageDown') return
      const current = api.value?.valueAsNumber
      if (typeof current !== 'number' || !Number.isFinite(current)) return
      const step = Number(input.step) || 1
      let next = current + (event.key === 'PageUp' ? 10 : -10) * step
      const min = input.min === '' ? undefined : Number(input.min)
      const max = input.max === '' ? undefined : Number(input.max)
      if (min != null && Number.isFinite(min)) next = Math.max(min, next)
      if (max != null && Number.isFinite(max)) next = Math.min(max, next)
      event.preventDefault()
      api.value?.setValue?.(next)
    },
  }
})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="inputProps"
  >
    <slot />
  </Primitive>
</template>
