<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { alertDescriptionVariants } from '.'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="alert-description" :class="cn(alertDescriptionVariants(), props.class)">
    <slot />
  </div>
</template>
