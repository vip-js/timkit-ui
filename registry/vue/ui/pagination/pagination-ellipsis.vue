<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const paginationEllipsisVariants = cva('flex size-9 items-center justify-center')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn(paginationEllipsisVariants(), props.class)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
    <span class="sr-only">More pages</span>
  </span>
</template>
