<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const commandSeparatorVariants = cva('bg-border -mx-1 h-px')

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(commandSeparatorVariants(), props.class)"
    role="separator"
  />
</template>
