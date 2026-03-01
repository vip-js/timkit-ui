<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { selectContextKey } from '../../lib/injection-keys'

const selectTriggerVariants = cva(
    'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
)
const selectTriggerIconVariants = cva('h-4 w-4 opacity-50')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(selectContextKey);
</script>

<template>
  <button v-bind="api.getTriggerProps()" type="button" :class="cn(selectTriggerVariants(), props.class)">
    <slot />
    <svg class="selectTriggerIconVariants()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </button>
</template>
