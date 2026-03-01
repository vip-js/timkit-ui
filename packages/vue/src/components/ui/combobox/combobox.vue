<script setup lang="ts">
import { cn, comboboxRootVariants } from "@timui/core";
import { useCombobox, type ComboboxProps } from "./use-combobox";
import { provideComboboxContext } from "./use-combobox-context";



const props = defineProps<ComboboxProps>();

const api = useCombobox(props);

provideComboboxContext(api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="combobox" :class="cn(comboboxRootVariants(), props.class)">
    <slot />
  </div>
</template>
