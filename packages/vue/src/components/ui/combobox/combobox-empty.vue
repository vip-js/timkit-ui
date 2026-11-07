<script setup lang="ts">
import { computed } from "vue";
import { cn, comboboxEmptyVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

import { useComboboxContext } from "./use-combobox-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useComboboxContext();
const visible = computed(
  () => api.value.collection.size === 0 && api.value.inputValue.trim().length > 0
);
</script>

<template>
  <div v-if="visible" data-slot="combobox-empty" role="status" :class="cn(comboboxEmptyVariants(), props.class)">
    <slot />
  </div>
</template>
