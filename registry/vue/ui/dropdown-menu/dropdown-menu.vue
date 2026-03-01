<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { PositioningOptions } from "@zag-js/popper";
import * as menu from "@zag-js/menu";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const props = defineProps<{
  id?: string;
  class?: HTMLAttributes["class"];
  positioning?: PositioningOptions;
  open?: boolean;
  defaultOpen?: boolean;
}>();

const emit = defineEmits(["update:open", "openChange"]);

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
  positioning: props.positioning,
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details.open);
  },
}));

const service = useMachine(menu.machine, machineProps as any);
const api = computed(() => menu.connect(service, normalizeProps));

provide(dropdownMenuContextKey, api);
</script>

<template>
  <slot />
</template>
