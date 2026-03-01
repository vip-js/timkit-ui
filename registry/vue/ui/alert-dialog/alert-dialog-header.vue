<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertDialogHeaderVariants = cva('flex flex-col space-y-2 text-center sm:text-left')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(alertDialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
