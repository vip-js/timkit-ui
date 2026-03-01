<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useAccordionContext, useAccordionItemContext } from "./accordion-context";

const accordionTriggerVariants = cva(
    'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180'
)
const accordionTriggerIconVariants = cva(
    'pointer-events-none shrink-0 opacity-60 transition-transform duration-200'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const accordion = useAccordionContext();
const item = useAccordionItemContext();

const isOpen = computed(() => item.value.isOpen ?? false);
const isDisabled = computed(() => item.value.disabled ?? false);
const triggerProps = computed(() => {
  return accordion.value.api.getItemTriggerProps({
    value: item.value.value,
    disabled: isDisabled.value,
  });
});
</script>

<template>
  <div class="flex">
    <button
      v-bind="triggerProps"
      data-slot="accordion-trigger"
      :data-state="isOpen ? 'open' : 'closed'"
      type="button"
      :disabled="isDisabled"
      :class="
        cn(accordionTriggerVariants(), props.class)
      "
    >
      <slot />
      <slot name="icon">
        <svg :class="cn(accordionTriggerIconVariants())" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </slot>
    </button>
  </div>
</template>
