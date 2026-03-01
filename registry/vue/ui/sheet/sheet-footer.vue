<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const sheetFooterVariants = cva(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(sheetFooterVariants(), props.class)">
    <slot />
  </div>
</template>
