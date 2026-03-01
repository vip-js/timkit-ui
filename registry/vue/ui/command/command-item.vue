<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const commandItemVariants = cva(
    'aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)

const props = defineProps<{
  value?: string;
  label?: string;
  class?: HTMLAttributes["class"];
}>();

const context = inject("command") as any;
const item = computed(() => ({
  label: props.label ?? props.value ?? "",
  value: props.value ?? "",
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
    v-bind="context?.api.value?.getItemProps?.({ item: item.value })"
    :class="
      cn(
        commandItemVariants(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
