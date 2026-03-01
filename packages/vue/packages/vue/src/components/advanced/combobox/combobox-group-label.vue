<script setup lang="ts">
import { computed, inject } from "vue";
import { cn, comboboxGroupLabelVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ htmlFor: string; class?: HTMLAttributes["class"] }>();
const api = inject("combobox") as { value?: any };
const labelProps = computed(() => api?.value?.getItemGroupLabelProps?.({ htmlFor: props.htmlFor }) ?? {});
</script>

<template>
  <div v-bind="labelProps" data-slot="combobox-group-label" :class="cn(comboboxGroupLabelVariants(), props.class)">
    <slot />
  </div>
</template>
