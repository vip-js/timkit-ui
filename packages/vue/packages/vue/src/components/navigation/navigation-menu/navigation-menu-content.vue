<script setup lang="ts">
import { cn, navigationMenuContentVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="navigation-menu-content"
    :class="
      cn(
        navigationMenuContentVariants(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
