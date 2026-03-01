<script setup lang="ts">
import { cn, navigationMenuListVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <ul
    data-slot="navigation-menu-list"
    :class="
      cn(navigationMenuListVariants(), props.class)
    "
  >
    <slot />
  </ul>
</template>
