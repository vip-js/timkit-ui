<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div data-slot="navbar-content" :class="cn('flex h-16 items-center justify-between gap-4', props.class)">
    <slot />
  </div>
</template>
