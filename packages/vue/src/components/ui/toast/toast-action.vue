<script setup lang="ts">
import { cn, toastActionVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <button
    :class="
      cn(
        toastActionVariants(),
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
