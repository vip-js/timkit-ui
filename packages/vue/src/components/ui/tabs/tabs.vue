<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { useTabs } from "./use-tabs";
import { provideTabsContext } from "./use-tabs-context";

const props = defineProps<{
  modelValue?: string;
  value?: string;
  defaultValue?: string;
  id?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "manual" | "automatic";
  loopFocus?: boolean;
  composite?: boolean;
  deselectable?: boolean;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:modelValue", "change", "focusChange"]);

const api = useTabs(props, emit);
provideTabsContext(api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tabs" :class="cn(props.class)">
    <slot />
  </div>
</template>
