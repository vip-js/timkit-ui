<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { dialogConnect, dialogMachine } from "@timui/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  id?: string;
}>();

const emit = defineEmits(["update:open", "openChange"]);

const service = useMachine(dialogMachine, {
  context: {
    open: props.open ?? props.defaultOpen,
    id: props.id,
    modal: props.modal !== false,
    onOpenChange(details: any) {
      emit("update:open", details.open);
      emit("openChange", details.open);
    },
  },
});

const api = computed(() => dialogConnect(service.state.value, service.send, normalizeProps));

provide("dialog", api);

// controlled sync
watch(
  () => props.open,
  (val: any) => {
    if (val !== undefined && val !== api.value.open) {
      api.value.setOpen(val);
    }
  }
);
</script>

<template>
  <slot />
</template>
