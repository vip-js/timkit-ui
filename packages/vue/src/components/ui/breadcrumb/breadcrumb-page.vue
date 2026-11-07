<script setup lang="ts">
import { inject, onUnmounted, type HTMLAttributes } from 'vue'
import { breadcrumbPageVariants, cn } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
const unregister = inject<((current: boolean) => () => void) | null>('breadcrumb-register', null)?.(true)
onUnmounted(() => unregister?.())
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
