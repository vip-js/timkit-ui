<script setup lang="ts">
import { cn, toastTitleVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(toastTitleVariants(), props.class)">
    <slot />
  </div>
</template>
