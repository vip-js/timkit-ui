<script setup lang="ts">
import { computed, ref, useAttrs, type ComputedRef } from "vue";
import { useCommandContext } from "./use-command-context";
import { SearchIcon } from "lucide-vue-next";
import { cn, commandInputVariants, commandInputWrapperVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  listId?: string;
  expanded?: boolean;
}>();
type BindValue = string | number | boolean | null | undefined | ((event: Event) => void);
const context = useCommandContext();
const attrs = useAttrs();
const inputProps = computed(() => context?.api.value?.getInputProps?.() || {});
const inputLabel = computed(() => {
  const passed = attrs["aria-label"];
  const fromApi = (inputProps.value as { "aria-label"?: string })["aria-label"];
  return (typeof passed === "string" && passed) || fromApi || props.placeholder || "Command menu";
});
const inputEl = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
  if (context.disabled.value) return;
  const target = event.target as HTMLInputElement;
  const onInputHandler = inputProps.value.onInput as ((event: Event) => void) | undefined;
  const onChangeHandler = inputProps.value.onChange as ((event: Event) => void) | undefined;
  if (typeof onInputHandler === "function") onInputHandler(event);
  if (typeof onChangeHandler === "function") onChangeHandler(event);
  props.onValueChange?.(target.value);
};

defineExpose({
  inputEl,
});
</script>

<template>
  <div :class="commandInputWrapperVariants()" cmdk-input-wrapper>
    <SearchIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
    <input
      v-bind="inputProps"
      ref="inputEl"
      :placeholder="props.placeholder"
      :aria-label="inputLabel"
      :disabled="context.disabled.value || undefined"
      :aria-controls="props.listId"
      :aria-expanded="props.expanded"
      :class="
        cn(
          commandInputVariants(),
          props.class
        )
      "
      @input="onInput"
    />
  </div>
</template>
