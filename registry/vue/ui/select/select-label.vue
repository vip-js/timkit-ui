<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const selectLabelVariants = cva('py-1.5 pl-8 pr-2 text-sm font-semibold')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(selectLabelVariants(), props.class)">
    <slot />
  </div>
</template>
