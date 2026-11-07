<script setup lang="ts">
import { type HTMLAttributes, computed, inject, reactive, watchEffect } from "vue";
import { TooltipGroupKey } from "./tooltip-group";
import { usePassedProp } from "../../../hooks/passed-prop";
import type { PositioningOptions } from "@zag-js/popper";
import { useTooltip, type UseTooltipProps } from "./use-tooltip";
import { TooltipProvider } from "./use-tooltip-context";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  openDelay?: number;
  delayDuration?: number;
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
const group = inject(TooltipGroupKey, null);
const passed = usePassedProp();
const openDelay = computed(() => {
  const last = group?.lastOpened.value ?? 0;
  const skipFor = group?.skipDelayDuration.value ?? 0;
  if (group && last > 0 && Date.now() - last < skipFor) return 0;
  return props.delayDuration ?? props.openDelay ?? group?.delayDuration.value;
});
const hoverable = computed(() => {
  const explicit = passed<boolean>(props, "interactive");
  if (explicit !== undefined) return explicit;
  if (group?.disableHoverableContent.value === true) return false;
  if (group?.disableHoverableContent.value === false) return true;
  return undefined;
});
const source = reactive<UseTooltipProps>({
  ...props,
  delayDuration: props.delayDuration,
  interactive: props.interactive,
  onOpenChange(open: boolean) {
    if (open) group?.markOpened();
    props.onOpenChange?.(open);
  },
});
watchEffect(() => {
  source.delayDuration = openDelay.value;
  source.interactive = hoverable.value;
  source.open = passed<boolean | null>(props, "open");
  source.defaultOpen = passed<boolean>(props, "defaultOpen");
  source.disabled = props.disabled;
});

const api = useTooltip(source, emit);
TooltipProvider(api);
</script>

<template>
  <p v-if="api.open" role="status">Opened</p>
  <slot />
</template>
