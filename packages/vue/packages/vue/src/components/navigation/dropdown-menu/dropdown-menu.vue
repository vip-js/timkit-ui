<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { menuConnect, menuMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { PositioningOptions } from "@zag-js/popper";

const props = defineProps<{
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  loopFocus?: boolean;
  positioning?: PositioningOptions;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  closeOnSelect: props.closeOnSelect,
  loopFocus: props.loopFocus,
  positioning: props.positioning,
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("change", details.open);
  },
}));

const service = useMachine(menuMachine, machineProps);
const api = computed(() => menuConnect(service, normalizeProps));
provide("dropdown-menu", api);
</script>

<template>
  <slot />
</template>
