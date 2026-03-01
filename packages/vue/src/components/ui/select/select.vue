<script setup lang="ts">
import type { SelectVueProps } from "@timui/core";
import { useSelect } from "./use-select";
import { provideSelectContext } from "./use-select-context";

const props = defineProps<SelectVueProps>();

const emit = defineEmits(["update:modelValue", "change"]);
type SelectValueChangeDetails = Parameters<NonNullable<SelectVueProps["onValueChange"]>>[0];

const api = useSelect(props, emit);
provideSelectContext(api);
</script>

<template>
  <slot />
</template>
