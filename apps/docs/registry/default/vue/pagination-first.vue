<script setup lang="ts">
import { type HTMLAttributes, useAttrs } from "vue";
import { ChevronsLeft } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import PaginationLink from "./pagination-link.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
</script>

<template>
  <PaginationLink v-bind="attrs" size="default" :class="cn('gap-1 px-2.5', props.class)">
    <slot>
      <ChevronsLeft class="h-4 w-4" />
      <span class="sr-only">First</span>
    </slot>
  </PaginationLink>
</template>
