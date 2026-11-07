<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn, sheetDescriptionVariants } from "@timui/core";
import { useSheetContext } from "./use-sheet-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useSheetContext();
</script>

<template>
  <p
    v-bind="api.getDescriptionProps()"
    data-slot="sheet-description"
    :class="cn(sheetDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
