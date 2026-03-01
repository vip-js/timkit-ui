<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const breadcrumbPageVariants = cva('text-foreground font-normal')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="cn(breadcrumbPageVariants(), props.class)"
  >
    <slot />
  </span>
</template>
