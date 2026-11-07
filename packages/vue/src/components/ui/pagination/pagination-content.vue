<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { cn, paginationListVariants } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject(PaginationContextKey, null);
const pages = computed(() => context?.api.value?.pages ?? []);
const currentPage = computed(() => context?.api.value?.page);
const choose = (value: number) => {
  if (context?.disabled.value) return;
  context?.api.value?.setPage(value);
};
</script>

<template>
  <ul :class="cn(paginationListVariants(), props.class)">
    <slot>
      <template v-for="(item, index) in pages" :key="index">
        <li v-if="item.type === 'page'">
          <slot name="page" :page="item.value">
            <button
              type="button"
              data-slot="pagination-link"
              :aria-current="item.value === currentPage ? 'page' : undefined"
              :disabled="context?.disabled.value || undefined"
              @click="choose(item.value)"
            >
              {{ item.value }}
            </button>
          </slot>
        </li>
        <li v-else>
          <slot name="ellipsis" :index="index">
            <span data-slot="pagination-ellipsis" aria-hidden="true">...</span>
          </slot>
        </li>
      </template>
    </slot>
  </ul>
</template>
