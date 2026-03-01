<script setup lang="ts">
import { cn, navigationMenuLinkVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <a
    data-slot="navigation-menu-link"
    :class="
      cn(
        navigationMenuLinkVariants(),
        props.class
      )
    "
  >
    <slot />
  </a>
</template>
