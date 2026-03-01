<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const breadcrumbListVariants = cva(
    'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <ol :class="cn(breadcrumbListVariants(), props.class)">
    <slot />
  </ol>
</template>
