<script setup lang="ts">
import { computed, provide, watch, type HTMLAttributes } from "vue";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";
import type { PositioningOptions } from "@zag-js/popper";
import { useDropdownMenu } from "./use-dropdown-menu";
import { DropdownMenuProvider } from "./use-dropdown-menu-context";

const props = defineProps<{
  id?: string;
  open?: boolean | null;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  positioning?: PositioningOptions;
  onOpenChange?: (open: boolean) => void;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const api = useDropdownMenu(props, emit);
provide("dropdown-menu-disabled", computed(() => props.disabled === true));
provide(returnFocusKey, useReturnFocus(computed(() => !!api.value.open)));
DropdownMenuProvider(api);

watch(
  () => api.value.open,
  (open, _previous, onCleanup) => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      api.value.setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    onCleanup(() => document.removeEventListener('keydown', onKeyDown))
  }
)
</script>

<template>
  <slot />
</template>
