<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { alertTitleVariants } from '@timui/core'
import { cn } from '@timui/core'

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
