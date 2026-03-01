<script setup lang="ts">
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";
import NavigationMenuViewport from "./navigation-menu-viewport.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <nav
    data-slot="navigation-menu"
    :class="
      cn('relative z-10 flex max-w-max flex-1 items-center justify-center', props.class)
    "
  >
    <slot />
    <NavigationMenuViewport />
  </nav>
</template>
