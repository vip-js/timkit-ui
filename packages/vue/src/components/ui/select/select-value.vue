<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { computed, inject, type Ref } from "vue";
import { cn, selectValueVariants } from "@timui/core";

const props = defineProps<{ class?: string; placeholder?: string }>();
type SelectApi = {
  valueAsString?: string;
  value?: string | string[];
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const displayValue = computed(() => api?.value?.valueAsString || api?.value?.value || props.placeholder);
</script>

<template>
  <span :class="cn(selectValueVariants(), props.class)">
    <slot>
      {{ displayValue }}
    </slot>
  </span>
</template>
