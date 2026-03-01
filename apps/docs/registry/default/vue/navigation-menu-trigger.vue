<script setup lang="ts">
import { ChevronDownIcon } from "lucide-vue-next";
import { cn, navigationMenuTriggerStyle } from "@timui/core";
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
      class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </button>
</template>
