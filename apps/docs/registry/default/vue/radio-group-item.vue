<script setup lang="ts">
import { computed, inject } from "vue";
import { cn, radioGroupItemVariants } from "@timui/core";
import { Circle } from "lucide-vue-next";

const props = defineProps<{ value: string; class?: string; disabled?: boolean }>();
const api = inject("radio-group") as any;

const itemState = computed(() =>
  api?.value?.getItemState?.({ value: props.value, disabled: props.disabled })
);
const itemProps = computed(() =>
  api?.value?.getItemProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
const controlProps = computed(() =>
  api?.value?.getItemControlProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
const hiddenInputProps = computed(() =>
  api?.value?.getItemHiddenInputProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
</script>

<template>
  <label v-bind="itemProps" data-slot="radio-group-item">
    <div
      v-bind="controlProps"
      data-slot="radio-control"
      :class="cn(radioGroupItemVariants(), controlProps.class, props.class)"
    >
      <span data-slot="radio-indicator" class="flex items-center justify-center">
        <Circle
          v-if="itemState?.checked"
          class="h-2.5 w-2.5 fill-current text-current"
        />
      </span>
    </div>
    <input v-bind="hiddenInputProps" />
  </label>
</template>
