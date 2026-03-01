<script setup lang="ts">
import {
  cn,
  stepperIndicatorCheckVariants,
  stepperIndicatorLabelVariants,
  stepperIndicatorLoaderVariants,
  stepperIndicatorVariants,
} from '@timui/core'
import { useStepItem } from './stepper.vue'
import { CheckIcon, LoaderCircleIcon } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from '../../primitive'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    as: 'span',
  }
)

const { state, step, isLoading } = useStepItem()
</script>

<template>
  <Primitive
    data-slot="stepper-indicator"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        stepperIndicatorVariants(),
        props.class
      )
    "
    :data-state="state"
  >
    <slot>
        <span :class="stepperIndicatorLabelVariants()">
          {{ step }}
        </span>
        <CheckIcon
          :class="stepperIndicatorCheckVariants()"
          :size="16"
          aria-hidden="true"
        />
        <span v-if="isLoading" :class="stepperIndicatorLoaderVariants()">
          <LoaderCircleIcon class="animate-spin" :size="14" aria-hidden="true" />
        </span>
    </slot>
  </Primitive>
</template>
