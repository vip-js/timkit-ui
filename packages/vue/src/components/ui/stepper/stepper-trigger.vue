<script setup lang="ts">
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

const { setActiveStep } = useStepper()
const { step, isDisabled } = useStepItem()
</script>

<template>
  <Primitive
    data-slot="stepper-trigger"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        stepperTriggerVariants(),
        props.class
      )
    "
    :disabled="isDisabled"
    @click="setActiveStep(step)"
  >
    <slot />
  </Primitive>
</template>
