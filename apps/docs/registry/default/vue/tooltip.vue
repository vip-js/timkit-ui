<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { tooltipConnect, tooltipMachine } from "@timui/core";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
  closeOnPointerDown?: boolean;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
  closeOnClick?: boolean;
  interactive?: boolean;
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
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  closeOnPointerDown: props.closeOnPointerDown,
  closeOnEscape: props.closeOnEscape,
  closeOnScroll: props.closeOnScroll,
  closeOnClick: props.closeOnClick,
  interactive: props.interactive,
  positioning: props.positioning,
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("change", details.open);
  },
}));

const service = useMachine(tooltipMachine, machineProps);
const api = computed(() => tooltipConnect(service, normalizeProps));

provide("tooltip", { api });
</script>

<template>
  <slot />
</template>
