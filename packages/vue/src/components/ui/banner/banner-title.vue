<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { bannerTitleVariants } from '@timui/core'
import { cn } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <h5 data-slot="banner-title" :class="cn(bannerTitleVariants(), props.class)">
    <slot />
  </h5>
</template>
