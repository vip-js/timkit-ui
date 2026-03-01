<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { popoverConnect, popoverMachine } from "@timui/core";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscape?: boolean;
  positioning?: {
    placement?: string;
    gutter?: number;
    offset?: number;
  };
  id?: string;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  modal: props.modal,
  closeOnInteractOutside: props.closeOnInteractOutside,
  closeOnEscape: props.closeOnEscape,
  positioning: props.positioning,
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("change", details.open);
  },
}));

const service = useMachine(popoverMachine, machineProps);
const api = computed(() => popoverConnect(service, normalizeProps));

provide("popover", { api });
</script>

<template>
  <slot />
</template>
