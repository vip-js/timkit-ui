<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { bannerActionsVariants } from '@timui/core'
import { cn } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="banner-actions" :class="cn(bannerActionsVariants(), props.class)">
    <slot />
  </div>
</template>
