<script setup lang="ts">
import { computed, provide, watch } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { dialogConnect, dialogMachine } from "@timui/core";

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  id?: string;
}>();

const emit = defineEmits(["update:open", "openChange"]);

const service = useMachine(dialogMachine, {
  context: {
    open: props.open ?? props.defaultOpen ?? false,
    modal: true,
    id: props.id,
    onOpenChange(details: any) {
      emit("update:open", details.open);
      emit("openChange", details.open);
    },
  },
});

const api = computed(() => dialogConnect(service.state.value, service.send, normalizeProps));
provide("alert-dialog", api);

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
