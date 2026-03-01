<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("accordion") as any;
const item = inject("accordion-item") as any;
const isOpen = computed(() => item.value?.isOpen ?? false);
const contentProps = computed(() =>
  api.value?.getItemContentProps({ value: item.value?.value, disabled: item.value?.disabled }) || {}
);
</script>

<template>
  <div
    v-bind="contentProps"
    data-slot="accordion-content"
    :data-state="isOpen ? 'open' : 'closed'"
    :hidden="!isOpen"
    :class="
      cn(
        'overflow-hidden text-sm transition-all',
        isOpen ? 'animate-accordion-down' : 'animate-accordion-up',
        props.class
      )
    "
  >
    <div class="pt-0 pb-4">
      <slot />
    </div>
  </div>
</template>
