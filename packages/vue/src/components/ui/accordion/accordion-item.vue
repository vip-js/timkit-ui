<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { accordionItemVariants, cn } from "@timui/core";
import { useAccordionContext, AccordionItemProvider } from "./use-accordion-context";

const props = defineProps<{ value: string; class?: HTMLAttributes["class"]; disabled?: boolean }>();
const api = useAccordionContext();
inject<((value: string) => void) | null>("accordion-register", null)?.(props.value);

const passedDisabled = () => (props.disabled ? true : undefined);

const itemState = computed(() =>
  api.value.getItemState({ value: props.value, disabled: passedDisabled() })
);

const isOpen = computed(() => itemState.value.expanded);
const itemProps = computed(() =>
  api.value.getItemProps({ value: props.value, disabled: passedDisabled() })
);

AccordionItemProvider(
  computed(() => ({
    value: props.value,
    disabled: itemState.value.disabled,
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
