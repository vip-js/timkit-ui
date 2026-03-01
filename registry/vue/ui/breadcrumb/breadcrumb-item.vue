<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <li :class="cn(breadcrumbItemVariants(), props.class)">
    <slot />
  </li>
</template>
