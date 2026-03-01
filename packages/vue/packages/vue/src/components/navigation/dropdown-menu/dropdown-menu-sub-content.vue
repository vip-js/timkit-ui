<script setup lang="ts">
import { cn, dropdownMenuSubContentVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="dropdown-menu-sub-content"
    :class="
      cn(
        dropdownMenuSubContentVariants(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
