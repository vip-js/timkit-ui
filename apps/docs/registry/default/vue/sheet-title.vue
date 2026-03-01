<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn, sheetTitleVariants } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <h2 :class="cn(sheetTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
