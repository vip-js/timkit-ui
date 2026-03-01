<script setup lang="ts">
import { cn, dropdownMenuSubTriggerVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>();
</script>

<template>
  <div
    data-slot="dropdown-menu-sub-trigger"
    :class="
      cn(
        dropdownMenuSubTriggerVariants(),
        props.inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-auto h-4 w-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </div>
</template>
