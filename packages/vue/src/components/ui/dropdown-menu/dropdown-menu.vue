<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import type { PositioningOptions } from "@zag-js/popper";
import { useDropdownMenu } from "./use-dropdown-menu";
import { DropdownMenuProvider } from "./use-dropdown-menu-context";

const props = defineProps<{
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  loopFocus?: boolean;
  positioning?: PositioningOptions;
  onOpenChange?: (open: boolean) => void;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open", "change"]);

const api = useDropdownMenu(props, emit);
DropdownMenuProvider(api);
</script>

<template>
  <slot />
</template>
