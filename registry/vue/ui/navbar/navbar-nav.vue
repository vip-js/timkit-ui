<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <nav data-slot="navbar-nav" :class="cn('flex items-center gap-4', props.class)">
    <slot />
  </nav>
</template>
