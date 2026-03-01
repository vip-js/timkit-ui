<script setup lang="ts">
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3 data-slot="stepper-title" :class="cn('text-sm font-medium', props.class)">
    <slot />
  </h3>
</template>
