<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import type { PositioningOptions } from "@zag-js/popper";
import { usePopover } from "./use-popover";
import { PopoverProvider } from "./use-popover-context";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscape?: boolean;
  positioning?: PositioningOptions;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const api = usePopover(props, emit);
PopoverProvider(api);
</script>

<template>
  <slot />
</template>
