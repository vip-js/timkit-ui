<script setup lang="ts">
import { computed, provide, watch, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as dialog from "@zag-js/dialog";
import { alertDialogContextKey } from '../../lib/injection-keys'

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  id?: string;
  closeOnInteractOutside?: boolean;
}>();

const emit = defineEmits(["update:open", "openChange"]);

const machineProps = computed(() => ({
  id: props.id,
  open: props.open,
  defaultOpen: props.defaultOpen,
  modal: true,
  role: "alertdialog",
  closeOnInteractOutside: props.closeOnInteractOutside ?? false, // Alert dialog typically blocks outside interaction closing
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details.open);
  },
}));

const service = useMachine(dialog.machine, machineProps as any);
const api = computed(() => dialog.connect(service, normalizeProps));

provide(alertDialogContextKey, api);

watch(
  () => props.open,
  (val) => {
    if (val !== undefined && val !== api.value.open) {
      api.value.setOpen(val);
    }
  }
);
</script>

<template>
  <slot />
</template>
