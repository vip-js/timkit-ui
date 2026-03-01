<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import { useCommandContext } from "./use-command-context";
import { SearchIcon } from "lucide-vue-next";
import { cn, commandInputVariants, commandInputWrapperVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  onValueChange?: (value: string) => void;
  listId?: string;
  expanded?: boolean;
}>();
type BindValue = string | number | boolean | null | undefined | ((event: Event) => void);
const context = useCommandContext();
const inputProps = computed(() => context?.api.value?.getInputProps?.() || {});
const inputEl = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
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
    <SearchIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <input
      v-bind="inputProps"
      ref="inputEl"
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
