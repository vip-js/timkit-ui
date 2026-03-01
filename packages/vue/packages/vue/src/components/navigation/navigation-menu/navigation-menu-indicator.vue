<script setup lang="ts">
import { cn, navigationMenuIndicatorIconVariants, navigationMenuIndicatorVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="navigation-menu-indicator"
    :class="
      cn(
        navigationMenuIndicatorVariants(),
        props.class
      )
    "
  >
    <div :class="navigationMenuIndicatorIconVariants()" />
  </div>
</template>
