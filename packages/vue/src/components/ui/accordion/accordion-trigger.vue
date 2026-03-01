<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import {
  accordionTriggerIconVariants,
  accordionTriggerVariants,
  cn,
} from "@timui/core";
import { useAccordionContext, useAccordionItemContext } from "./use-accordion-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAccordionContext();
const item = useAccordionItemContext();

const isOpen = computed(() => item.value.isOpen);
const isDisabled = computed(() => item.value.disabled || false);
const triggerProps = computed(() => {
  return api.value.getItemTriggerProps({
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
        <ChevronDownIcon :size="16" :class="cn(accordionTriggerIconVariants())" />
      </slot>
    </button>
  </div>
</template>
