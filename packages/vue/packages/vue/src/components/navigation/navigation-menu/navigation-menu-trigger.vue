<script setup lang="ts">
import { ChevronDownIcon } from "lucide-vue-next";
import { cn, navigationMenuTriggerIconVariants, navigationMenuTriggerStyle } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <button
    data-slot="navigation-menu-trigger"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class)"
    type="button"
  >
    <slot />
    <ChevronDownIcon
      :class="navigationMenuTriggerIconVariants()"
      aria-hidden="true"
    />
  </button>
</template>
