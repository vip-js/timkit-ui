<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { breadcrumbItemVariants, cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <li data-slot="breadcrumb-item" :class="cn(breadcrumbItemVariants(), props.class)">
    <slot />
  </li>
</template>
