<script setup lang="ts">
import { computed } from 'vue'
import { cn, stepperTriggerVariants } from '@timui/core'
import { useStepper, useStepItem } from './stepper.vue'
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from '../../primitive'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    as: 'button',
  }
)

const { setActiveStep, readOnly, orientation } = useStepper()
const { step, state, isDisabled } = useStepItem()
const blocked = computed(() => isDisabled.value || readOnly.value)

const choose = () => {
  if (blocked.value) return
  setActiveStep(step)
}

const onKey = (event: KeyboardEvent) => {
  if (blocked.value) return
  const root = event.currentTarget instanceof HTMLElement ? event.currentTarget.closest('[data-slot="stepper"]') : null
  if (!root) return
  const horizontal = orientation.value === 'horizontal'
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="stepper-trigger"]')].filter(
    (node) => !node.disabled
  )
  const current = event.currentTarget instanceof HTMLButtonElement ? triggers.indexOf(event.currentTarget) : -1
  if (current < 0) return
  let next = current
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = triggers.length - 1
  else {
    const delta = horizontal
      ? event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowLeft'
          ? -1
          : 0
      : event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return
    next = current + delta
    if (next < 0 || next >= triggers.length) return
  }
  const stepValue = Number(triggers[next]?.dataset.step)
  if (!Number.isFinite(stepValue) || stepValue === step) return
  event.preventDefault()
  setActiveStep(stepValue)
}
</script>

<template>
  <Primitive
    data-slot="stepper-trigger"
    :data-step="step"
    :aria-current="state === 'active' ? 'step' : undefined"
    @keydown="onKey"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        stepperTriggerVariants(),
        props.class
      )
    "
    :disabled="blocked"
    @click="choose"
  >
    <slot />
  </Primitive>
</template>
