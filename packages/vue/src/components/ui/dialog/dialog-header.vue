<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, dialogHeaderVariants } from "@timui/core";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div data-slot="dialog-header" :class="cn(dialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
