<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { ChevronLeft } from "lucide-vue-next";
import { cn, paginationPreviousVariants } from '@timui/core';
import Button from "../button/button.vue";
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject(PaginationContextKey, null);
const triggerProps = computed(() => context?.api.value?.getPrevTriggerProps?.() ?? {});
</script>

<template>
  <li>
    <Button
      v-bind="triggerProps"
      :class="cn(paginationPreviousVariants(), props.class)"
      variant="ghost"
      size="default"
    >
      <slot>
        <ChevronLeft class="h-4 w-4" />
        <span>Previous</span>
      </slot>
    </Button>
  </li>
</template>
