<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useAccordionContext, useAccordionItemContext } from "./accordion-context";

const accordionContentVariants = cva(
    'overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
)
const accordionContentInnerVariants = cva('pt-0 pb-4')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const accordion = useAccordionContext();
const item = useAccordionItemContext();
const isOpen = computed(() => item.value.isOpen ?? false);
const contentProps = computed(() => {
  return (
    accordion.value.api.getItemContentProps({
      value: item.value.value,
      disabled: item.value.disabled,
    }) || {}
  );
});
</script>

<template>
  <div
    v-bind="contentProps"
    data-slot="accordion-content"
    :data-state="isOpen ? 'open' : 'closed'"
    :hidden="!isOpen"
    :class="
      cn(accordionContentVariants(), props.class)
    "
  >
    <div :class="cn(accordionContentInnerVariants())">
      <slot />
    </div>
  </div>
</template>
