<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from "vue";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  value: string;
  label?: string;
  class?: HTMLAttributes["class"];
}>();

const context = inject("command") as any;
const item = computed(() => ({
  label: props.label ?? props.value,
  value: props.value,
}));

onMounted(() => {
  context?.registerItem?.(item.value);
});

onBeforeUnmount(() => {
  context?.unregisterItem?.(props.value);
});
</script>

<template>
  <div
    v-bind="context?.api.value?.getItemProps?.({ item })"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
