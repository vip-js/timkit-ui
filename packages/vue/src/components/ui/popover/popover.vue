<script setup lang="ts">
import { type HTMLAttributes, computed, provide } from "vue";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";
import type { PositioningOptions } from "@zag-js/popper";
import { usePassedProp } from "../../../hooks/passed-prop";
import { usePopover } from "./use-popover";
import { PopoverDisabledKey, PopoverProvider } from "./use-popover-context";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscape?: boolean;
  positioning?: PositioningOptions;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);
const passed = usePassedProp();
const disabled = computed(() => passed<boolean>(props, "disabled") === true);
provide(PopoverDisabledKey, disabled);

const api = usePopover(props, emit);
provide(returnFocusKey, useReturnFocus(computed(() => !!api.value.open)));
PopoverProvider(api);
</script>

<template>
  <p v-if="api.open" role="status">Opened</p>
  <slot />
</template>
