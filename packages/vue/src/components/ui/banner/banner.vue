<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { bannerVariants } from '@timui/core'
import { cn } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="banner" :class="cn(bannerVariants(), props.class)">
    <slot />
  </div>
</template>
