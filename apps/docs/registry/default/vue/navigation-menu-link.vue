<script setup lang="ts">
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <a
    data-slot="navigation-menu-link"
    :class="
      cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        props.class
      )
    "
  >
    <slot />
  </a>
</template>
