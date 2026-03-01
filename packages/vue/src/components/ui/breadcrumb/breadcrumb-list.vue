<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { breadcrumbListVariants, cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ol data-slot="breadcrumb-list" :class="cn(breadcrumbListVariants(), props.class)">
    <slot />
  </ol>
</template>
