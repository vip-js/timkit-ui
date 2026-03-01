<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const selectSeparatorVariants = cva('-mx-1 my-1 h-px bg-muted')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(selectSeparatorVariants(), props.class)" />
</template>
