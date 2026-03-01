<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { bannerContentVariants } from '@timui/core'
import { cn } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="banner-content" :class="cn(bannerContentVariants(), props.class)">
    <slot />
  </div>
</template>
