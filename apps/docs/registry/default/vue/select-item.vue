<script setup lang="ts">
import { computed, inject } from "vue";
import { CheckIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  value: string;
  label?: string;
  class?: string;
}>();

const api = inject("select") as any;
const item = computed(() => ({
  label: props.label ?? props.value,
  value: props.value,
}));

const isSelected = computed(() => {
  const value = api.value?.value;
  if (Array.isArray(value)) return value.includes(props.value);
  return value === props.value;
});
</script>

<template>
  <div
    v-bind="api.value?.getItemProps({ item })"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon v-if="isSelected" class="h-4 w-4" />
    </span>
    <span class="truncate">
      <slot />
    </span>
  </div>
</template>
