<script setup lang="ts">
import { type HTMLAttributes, computed, provide, useAttrs } from "vue";
import { cn, pageCount, paginationRootVariants } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";
import { usePagination } from './use-pagination';

const props = defineProps<{
  id?: string;
  page?: number | null;
  defaultPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  count?: number;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  onPageChange?: (details: { page: number; pageSize: number }) => void;
  onPageSizeChange?: (details: { page: number; pageSize: number }) => void;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
  (e: "update:pageSize", value: number): void;
  (e: "change", value: { page: number; pageSize: number }): void;
}>();

const attrs = useAttrs();
const navLabel = computed(() => {
  const label = attrs["aria-label"];
  return typeof label === "string" && label ? label : "pagination";
});
const { api, page } = usePagination(props, emit);
provide(PaginationContextKey, { api, page, disabled: computed(() => props.disabled === true) });
const pages = computed(() =>
  typeof props.count === "number" ? pageCount(props.count, props.pageSize ?? 10) : 0
);
</script>

<template>
  <nav
    role="navigation"
    :class="cn(paginationRootVariants(), props.class)"
    v-bind="api?.getRootProps?.()"
    :aria-label="navLabel"
    :aria-disabled="props.disabled || undefined"
    :data-page="page == null ? undefined : page"
  >
    <p v-if="pages > 0 && page != null" role="status">{{ `Page ${page} of ${pages}` }}</p>
    <slot />
  </nav>
</template>
