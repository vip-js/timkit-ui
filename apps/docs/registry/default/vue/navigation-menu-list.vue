<script setup lang="ts">
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <ul
    data-slot="navigation-menu-list"
    :class="
      cn('group flex flex-1 list-none items-center justify-center gap-1', props.class)
    "
  >
    <slot />
  </ul>
</template>
