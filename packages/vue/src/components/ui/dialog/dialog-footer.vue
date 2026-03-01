<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, dialogFooterVariants } from "@timui/core";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div data-slot="dialog-footer" :class="cn(dialogFooterVariants(), props.class)">
    <slot />
  </div>
</template>
