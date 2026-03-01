<script setup lang="ts">
import { cn, navigationMenuViewportVariants, navigationMenuViewportWrapperVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="navigationMenuViewportWrapperVariants()">
    <div
      data-slot="navigation-menu-viewport"
      :class="
        cn(
          navigationMenuViewportVariants(),
          props.class
        )
      "
    />
  </div>
</template>
