<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import PaginationLink from "./pagination-link.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    :class="cn('gap-1 px-2.5 sm:ps-4', props.class)"
    v-bind="delegatedProps"
  >
    <span class="hidden sm:block">Next</span>
    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
  </PaginationLink>
</template>
