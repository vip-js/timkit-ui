<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import {
  accordionContentInnerVariants,
  accordionContentVariants,
  cn,
} from "@timui/core";
import { useAccordionContext, useAccordionItemContext } from "./use-accordion-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAccordionContext();
const item = useAccordionItemContext();

const isOpen = computed(() => item.value.isOpen);
const contentProps = computed(() => {
  return (
    api.value.getItemContentProps({
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
