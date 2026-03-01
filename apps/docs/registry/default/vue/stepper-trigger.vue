<script setup lang="ts">
import { cn } from "@/lib/utils"
import { useStepper, useStepItem } from './stepper.vue'
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from './primitive'

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
        'focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
        props.class
      )
    "
    :disabled="isDisabled.value"
    @click="setActiveStep(step)"
  >
    <slot />
  </Primitive>
</template>
