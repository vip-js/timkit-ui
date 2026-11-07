<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { useDialog, type UseDialogProps, type UseDialogEmits } from "./use-dialog";
import { DialogProvider } from "./use-dialog-context";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";
import { usePassedProp } from "../../../hooks/passed-prop";

type DialogRootProps = UseDialogProps & { disabled?: boolean };
const props = defineProps<DialogRootProps>();
const emit = defineEmits<UseDialogEmits>();

const api = useDialog(props, emit);
const passed = usePassedProp();
provide("dialog-disabled", computed(() => props.disabled === true));
provide("dialog-has-title", ref(false));
provide(
  "dialog-modal",
  computed(() => passed<boolean | null>(props, "modal") !== false)
);
const rememberTrigger = useReturnFocus(computed(() => api.value.open));
provide(returnFocusKey, rememberTrigger);
DialogProvider(api);
</script>

<template>
  <p v-if="api.open" role="status">Opened</p>
  <slot />
</template>
