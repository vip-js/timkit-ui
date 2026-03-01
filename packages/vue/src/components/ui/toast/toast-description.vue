<script setup lang="ts">
import { cn, toastDescriptionVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(toastDescriptionVariants(), props.class)">
    <slot />
  </div>
</template>
