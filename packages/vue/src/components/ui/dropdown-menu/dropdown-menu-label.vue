<script setup lang="ts">
import { cn, dropdownMenuLabelVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>();
</script>

<template>
  <div
    data-slot="dropdown-menu-label"
    :class="cn(dropdownMenuLabelVariants(), props.inset && 'pl-8', props.class)"
  >
    <slot />
  </div>
</template>
