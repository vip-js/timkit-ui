<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import { selectContextKey } from '../../lib/injection-keys'

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(selectContextKey);
</script>

<template>
  <div v-if="api.visibleRange.end < api.collection.count" class="flex cursor-default items-center justify-center py-1" :class="props.class">
    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </div>
</template>
