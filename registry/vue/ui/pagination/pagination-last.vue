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
    aria-label="Go to last page"
    size="default"
    :class="cn('gap-1 px-2.5', props.class)"
    v-bind="delegatedProps"
  >
    <span class="hidden sm:block">Last</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
  </PaginationLink>
</template>
