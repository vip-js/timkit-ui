<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const dialogHeaderVariants = cva('flex flex-col space-y-1.5 text-center sm:text-left')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(dialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
