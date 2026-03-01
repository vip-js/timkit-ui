<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const menuShortcutVariants = cva('ms-auto text-xs tracking-widest opacity-60')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <span :class="cn(menuShortcutVariants(), props.class)">
    <slot />
  </span>
</template>
