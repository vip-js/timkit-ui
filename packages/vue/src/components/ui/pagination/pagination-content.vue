<script setup lang="ts">
import { type HTMLAttributes, computed, inject, useSlots } from "vue";
import { cn, paginationListVariants } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const slots = useSlots();
const context = inject(PaginationContextKey, null);
const pages = computed(() => context?.api.value?.pages ?? []);
</script>

<template>
  <ul :class="cn(paginationListVariants(), props.class)">
    <slot>
      <template v-for="(item, index) in pages" :key="index">
        <li v-if="item.type === 'page'">
          <slot name="page" :page="item.value" />
        </li>
        <li v-else>
          <slot name="ellipsis" :index="index" />
        </li>
      </template>
    </slot>
  </ul>
</template>
