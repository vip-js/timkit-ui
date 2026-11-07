<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { useTabs } from "./use-tabs";
import { provideTabsContext } from "./use-tabs-context";

const props = defineProps<{
  modelValue?: string | null;
  value?: string;
  defaultValue?: string;
  id?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "manual" | "automatic";
  loopFocus?: boolean;
  composite?: boolean;
  deselectable?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onFocusChange?: (value: string) => void;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:modelValue", "change", "focusChange"]);

const api = useTabs(props, emit);
provideTabsContext(api);
provide("tabs-disabled", computed(() => props.disabled === true));
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="tabs"
    :aria-disabled="props.disabled || undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(props.class)"
  >
    <slot />
  </div>
</template>
