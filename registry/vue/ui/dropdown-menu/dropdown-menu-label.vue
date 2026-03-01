<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const menuLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(menuLabelVariants(), props.class)">
    <slot />
  </div>
</template>
