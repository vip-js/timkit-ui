<script setup lang="ts">
import { cn, commandGroupVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    :class="
      cn(
        commandGroupVariants(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
