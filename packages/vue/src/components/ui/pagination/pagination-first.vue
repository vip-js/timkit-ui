<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { ChevronsLeft } from "lucide-vue-next";
import { cn, paginationFirstVariants } from '@timui/core';
import Button from "../button/button.vue";
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject(PaginationContextKey, null);
const triggerProps = computed(() => context?.api.value?.getFirstTriggerProps?.() ?? {});
</script>

<template>
  <li>
    <Button
      v-bind="triggerProps"
      :class="cn(paginationFirstVariants(), props.class)"
      variant="ghost"
      size="default"
    >
      <slot>
        <ChevronsLeft class="h-4 w-4" />
        <span class="sr-only">First</span>
      </slot>
    </Button>
  </li>
</template>
