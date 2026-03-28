<script setup lang="ts">
import { type HTMLAttributes, provide } from "vue";
import { cn, paginationRootVariants } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";
import { usePagination } from './use-pagination';

const props = defineProps<{
  id?: string;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  count?: number;
  siblingCount?: number;
  boundaryCount?: number;
  onPageChange?: (details: { page: number; pageSize: number }) => void;
  onPageSizeChange?: (details: { page: number; pageSize: number }) => void;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
  (e: "update:pageSize", value: number): void;
  (e: "change", value: { page: number; pageSize: number }): void;
}>();

const api = usePagination(props, emit);
provide(PaginationContextKey, { api });
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    :class="cn(paginationRootVariants(), props.class)"
    v-bind="api?.getRootProps?.()"
  >
    <slot />
  </nav>
</template>
