<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { alertTitleVariants } from '.'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <h5 data-slot="alert-title" :class="cn(alertTitleVariants(), props.class)">
    <slot />
  </h5>
</template>
