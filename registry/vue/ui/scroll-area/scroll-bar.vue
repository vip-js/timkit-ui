<script setup lang="ts">
import { cn } from '../../lib/utils'
import type { HTMLAttributes } from 'vue'
import { cva } from "class-variance-authority";

const scrollAreaScrollbarVariants = cva(
    'flex touch-none select-none transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent'
)

// This is a visual-only stub since native CSS overflow is used in scroll-area.vue
// Native scrollbars are managed by the browser; this component is kept for API compatibility
withDefaults(
  defineProps<{ class?: HTMLAttributes['class']; orientation?: 'vertical' | 'horizontal' }>(),
  { orientation: 'vertical' }
)
</script>

<template>
  <!-- Native scroll area uses browser scrollbars; this component is preserved for API compatibility -->
</template>
