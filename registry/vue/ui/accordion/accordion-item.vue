<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useAccordionContext, AccordionItemProvider } from "./accordion-context";

const accordionItemVariants = cva('w-full border-b last:border-b-0')

const props = defineProps<{ value: string; class?: HTMLAttributes["class"]; disabled?: boolean }>();
const accordion = useAccordionContext();

const itemState = computed(() =>
  accordion.value.api.getItemState({ value: props.value, disabled: props.disabled })
);
const isOpen = computed(() => itemState.value?.expanded ?? false);
const itemProps = computed(() =>
  accordion.value.api.getItemProps({ value: props.value, disabled: props.disabled }) || {}
);

AccordionItemProvider(
  computed(() => ({
    value: props.value,
    disabled: itemState.value?.disabled ?? false,
    isOpen: isOpen.value,
  }))
);
</script>

<template>
  <div
    v-bind="itemProps"
    data-slot="accordion-item"
    :data-state="isOpen ? 'open' : 'closed'"
    :class="cn(accordionItemVariants(), props.class)"
  >
    <slot />
  </div>
</template>
