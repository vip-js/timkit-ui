<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <header data-slot="navbar" :class="cn('w-full', props.class)">
    <slot />
  </header>
</template>
