<script setup lang="ts">
import { type HTMLAttributes, provide, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    defaultValue?: number
    value?: number
    orientation?: 'horizontal' | 'vertical'
    class?: HTMLAttributes['class']
  }>(),
  {
    defaultValue: 1,
    orientation: 'vertical',
  }
)

const currentStep = computed(() => props.value ?? props.defaultValue)
provide('timeline-active-step', currentStep)
provide('timeline-orientation', computed(() => props.orientation))
</script>

<template>
  <div
    data-slot="timeline"
    :class="cn('group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col', props.class)"
    :data-orientation="props.orientation"
  >
    <slot />
  </div>
</template>
