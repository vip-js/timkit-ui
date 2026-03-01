<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { ChevronRight } from "lucide-vue-next";
import { cn, paginationNextVariants } from '@timui/core';
import Button from "../button/button.vue";
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject(PaginationContextKey, null);
const triggerProps = computed(() => context?.api.value?.getNextTriggerProps?.() ?? {});
</script>

<template>
  <li>
    <Button
      v-bind="triggerProps"
      :class="cn(paginationNextVariants(), props.class)"
      variant="ghost"
      size="default"
    >
      <slot>
        <span>Next</span>
        <ChevronRight class="h-4 w-4" />
      </slot>
    </Button>
  </li>
</template>
