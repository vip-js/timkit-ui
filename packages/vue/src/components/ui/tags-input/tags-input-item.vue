<script setup lang="ts">
import { computed, provide } from "vue";
import { cn, tagsInputItemDeleteVariants, tagsInputItemSelectedVariants, tagsInputItemVariants } from "@timui/core";
import { useTagsInputContext } from "./use-tags-input-context";
import { XIcon } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";

export type TagsInputItemContext = {
  getRemoveTriggerProps: () => Record<string, string | number | boolean | undefined>;
};

const props = defineProps<{ class?: HTMLAttributes["class"]; value: string; index: string | number }>();

const api = useTagsInputContext();
const itemProps = computed(() => api.value.getItemProps?.({ value: props.value, index: props.index, disabled: false }) ?? {});
const itemState = computed(() => api.value.getItemState?.({ value: props.value, index: props.index }));
const itemInputProps = computed(() => api.value.getItemInputProps?.({ value: props.value, index: props.index, disabled: false }) ?? {});
const deleteProps = computed(() => api.value.getItemDeleteTriggerProps?.({ value: props.value, index: props.index, disabled: false }) ?? {});

const itemContext = computed<TagsInputItemContext>(() => {
  return {
    getRemoveTriggerProps: () => api.value.getItemDeleteTriggerProps?.({ value: props.value, index: props.index, disabled: false }) ?? {},
  };
});
provide("tags-input-item", itemContext);
</script>

<template>
  <div
    v-bind="itemProps"
    data-slot="tags-input-item"
    :class="
      cn(
        tagsInputItemVariants(),
        tagsInputItemSelectedVariants(),
        props.class
      )
    "
    :data-disabled="itemState?.disabled ? '' : undefined"
  >
    <span class="leading-none">
      <slot>{{ props.value }}</slot>
    </span>
    <button
      v-bind="deleteProps"
      type="button"
      data-slot="tags-input-item-delete"
      :class="tagsInputItemDeleteVariants()"
      aria-label="Remove tag"
    >
      <XIcon class="w-4 h-4" />
    </button>
    <input v-bind="itemInputProps" />
  </div>
</template>
