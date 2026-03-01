<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div data-slot="banner" :class="cn('relative flex w-full items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3', props.class)">
    <slot />
  </div>
</template>
