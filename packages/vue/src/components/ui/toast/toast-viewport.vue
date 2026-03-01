<script setup lang="ts">
import { cn, toastViewportVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <ol
    :class="
      cn(
        toastViewportVariants(),
        props.class
      )
    "
  >
    <slot />
  </ol>
</template>
