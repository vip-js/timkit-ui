<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { alertDescriptionVariants } from '@timui/core'
import { cn } from '@timui/core'

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
