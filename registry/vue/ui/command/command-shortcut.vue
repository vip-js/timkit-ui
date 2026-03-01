<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const commandShortcutVariants = cva('ms-auto text-xs tracking-widest opacity-60')

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span :class="cn(commandShortcutVariants(), props.class)">
    <slot />
  </span>
</template>
