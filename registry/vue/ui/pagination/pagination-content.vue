<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const paginationListVariants = cva('flex flex-row items-center gap-1')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <ul :class="cn(paginationListVariants(), props.class)">
    <slot />
  </ul>
</template>
