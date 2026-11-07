<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { cn, tagsInputInputVariants } from "@timui/core";
import { useTagsInputContext } from "./use-tags-input-context";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; placeholder?: string }>();
const api = useTagsInputContext();
const attrs = useAttrs();
const inputProps = computed(() => api.value.getInputProps?.() ?? {});
const fieldProps = computed(() => {
  const { onKeyDown: _onKeyDown, ...rest } = inputProps.value
  return rest
})
const inputLabel = computed(() => {
  const passed = attrs["aria-label"];
  const labelledBy = attrs["aria-labelledby"];
  const fromApi = inputProps.value["aria-label"] || inputProps.value["aria-labelledby"];
  if ((typeof passed === "string" && passed) || labelledBy || fromApi) return undefined;
  const machinePlaceholder = inputProps.value.placeholder;
  return (
    props.placeholder ||
    (typeof machinePlaceholder === "string" ? machinePlaceholder : "") ||
    "Add a tag"
  );
});

const onKeyDown = (event: KeyboardEvent) => {
  if ((inputProps.value as { disabled?: boolean }).disabled) {
    event.preventDefault()
    return
  }
  const listener = inputProps.value.onKeyDown as ((event: KeyboardEvent) => void) | undefined
  listener?.(event)
}
</script>

<template>
  <input
    v-bind="fieldProps"
    data-slot="tags-input-input"
    :placeholder="props.placeholder"
    :aria-label="inputLabel"
    :class="cn(tagsInputInputVariants(), props.class)"
    @keydown="onKeyDown"
  />
</template>
