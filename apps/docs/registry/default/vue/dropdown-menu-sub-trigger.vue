<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>();
</script>

<template>
  <div
    data-slot="dropdown-menu-sub-trigger"
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent',
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
