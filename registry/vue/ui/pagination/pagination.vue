<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const paginationRootVariants = cva('mx-auto flex w-full justify-center')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    :class="cn(paginationRootVariants(), props.class)"
  >
    <slot />
  </nav>
</template>
