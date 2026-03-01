<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { PositioningOptions } from "@zag-js/popper";
import * as popover from "@zag-js/popover";
import { popoverContextKey } from '../../lib/injection-keys'

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscape?: boolean;
  positioning?: PositioningOptions;
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

const service = useMachine(popover.machine, machineProps as any);
const api = computed(() => popover.connect(service, normalizeProps));

provide(popoverContextKey, api);
</script>

<template>
  <slot />
</template>
