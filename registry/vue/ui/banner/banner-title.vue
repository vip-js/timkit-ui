<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <h5 data-slot="banner-title" :class="cn('text-sm font-medium', props.class)"><slot /></h5>
</template>
