<script setup lang="ts">
import { cn } from "@/lib/utils"
import { useStepItem } from './stepper.vue'
import { CheckIcon, LoaderCircleIcon } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from './primitive'

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
        'bg-muted text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
        props.class
      )
    "
    :data-state="state"
  >
    <slot>
        <span class="transition-all group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0">
          {{ step }}
        </span>
        <CheckIcon
          class="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
          :size="16"
          aria-hidden="true"
        />
        <span v-if="isLoading" class="absolute transition-all">
          <LoaderCircleIcon class="animate-spin" :size="14" aria-hidden="true" />
        </span>
    </slot>
  </Primitive>
</template>
