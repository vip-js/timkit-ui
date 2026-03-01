<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { MoreHorizontal } from "lucide-vue-next";
import { cn, paginationEllipsisVariants } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ index: number; class?: HTMLAttributes["class"] }>();
const context = inject(PaginationContextKey, null);
const ellipsisProps = computed(() =>
  context?.api.value?.getEllipsisProps?.({ index: props.index }) ?? {}
);
</script>

<template>
  <li>
    <span
      v-bind="ellipsisProps"
      :class="cn(paginationEllipsisVariants(), props.class)"
    >
      <slot>
        <MoreHorizontal class="h-4 w-4" />
        <span class="sr-only">More pages</span>
      </slot>
    </span>
  </li>
</template>
