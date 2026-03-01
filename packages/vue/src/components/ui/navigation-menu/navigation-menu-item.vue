<script setup lang="ts">
import { cn, navigationMenuItemVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <li data-slot="navigation-menu-item" :class="cn(navigationMenuItemVariants(), props.class)">
    <slot />
  </li>
</template>
