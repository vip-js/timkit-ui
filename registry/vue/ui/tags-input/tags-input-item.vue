<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tagsInputContextKey } from '../../lib/injection-keys'

const tagsInputItemVariants = cva(
    'inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary/80'
)
const tagsInputItemSelectedVariants = cva('ring-2 ring-ring ring-offset-2')
const tagsInputItemDeleteVariants = cva(
    'ml-1 rounded-full outline-none hover:bg-background/20 focus:ring-2 focus:ring-ring focus:ring-offset-1'
)

const props = defineProps<{
  index: string | number;
  value: string;
  class?: HTMLAttributes["class"];
}>();

const api = inject(tagsInputContextKey);
const itemProps = computed(() => api?.value?.getItemProps?.({ index: props.index, value: props.value }) ?? {});
const itemState = computed(() => api?.value?.getItemState?.({ index: props.index, value: props.value }));
const deleteProps = computed(() =>
  api?.value?.getItemDeleteTriggerProps?.({ index: props.index, value: props.value }) ?? {}
);
const itemInputProps = computed(() =>
  api?.value?.getItemInputProps?.({ index: props.index, value: props.value }) ?? {}
);
</script>

<template>
  <div
    v-bind="itemProps"
    data-slot="tags-input-item"
    :class="
      cn(
        tagsInputItemVariants(),
        itemState?.selected ? tagsInputItemSelectedVariants() : '',
        props.class
      )
    "
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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <input v-bind="itemInputProps" />
  </div>
</template>
