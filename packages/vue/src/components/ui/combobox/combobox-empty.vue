<script setup lang="ts">
import { cn, comboboxEmptyVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div data-slot="combobox-empty" :class="cn(comboboxEmptyVariants(), props.class)">
    <slot />
  </div>
</template>
