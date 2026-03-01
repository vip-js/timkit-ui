<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>();
</script>

<template>
  <div
    data-slot="dropdown-menu-label"
    :class="cn('px-2 py-1.5 text-sm font-semibold', props.inset && 'pl-8', props.class)"
  >
    <slot />
  </div>
</template>
