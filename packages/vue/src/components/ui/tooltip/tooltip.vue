<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import type { PositioningOptions } from "@zag-js/popper";
import { useTooltip } from "./use-tooltip";
import { TooltipProvider } from "./use-tooltip-context";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  closeOnPointerDown?: boolean;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
  closeOnClick?: boolean;
  interactive?: boolean;
  positioning?: PositioningOptions;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const api = useTooltip(props, emit);
TooltipProvider(api);
</script>

<template>
  <slot />
</template>
