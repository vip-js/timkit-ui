<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { breadcrumbPageVariants, cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="breadcrumb-page"
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="cn(breadcrumbPageVariants(), props.class)"
  >
    <slot />
  </span>
</template>
