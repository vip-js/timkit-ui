<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { PositioningOptions } from "@zag-js/popper";
import * as tooltip from "@zag-js/tooltip";
import { tooltipContextKey } from '../../lib/injection-keys'

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
  positioning?: PositioningOptions;
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

const service = useMachine(tooltip.machine, machineProps as any);
const api = computed(() => tooltip.connect(service, normalizeProps));

provide(tooltipContextKey, api);
</script>

<template>
  <slot />
</template>
