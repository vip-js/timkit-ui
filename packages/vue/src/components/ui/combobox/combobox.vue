<script setup lang="ts">
import { ref } from "vue";
import { cn, comboboxRootVariants } from "@timui/core";
import { useCombobox, type ComboboxProps } from "./use-combobox";
import { provideComboboxContext, provideComboboxLabelPresence } from "./use-combobox-context";

const props = defineProps<ComboboxProps>();

const api = useCombobox(props);
const labelled = ref(false);

provideComboboxContext(api);
provideComboboxLabelPresence(labelled);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="combobox" :class="cn(comboboxRootVariants(), props.class)">
    <slot />
  </div>
</template>
