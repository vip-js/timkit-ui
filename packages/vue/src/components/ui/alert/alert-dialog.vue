<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { useAlertDialog, type UseAlertDialogProps, type UseAlertDialogEmits } from "../alert-dialog/use-alert-dialog";
import { provideAlertDialogContext } from "../alert-dialog/use-alert-dialog-context";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";

const props = defineProps<UseAlertDialogProps>();
const emit = defineEmits<UseAlertDialogEmits>();

const api = useAlertDialog(props, emit);
provide(returnFocusKey, useReturnFocus(computed(() => !!api.value.open)));
provideAlertDialogContext(api);
provide("alert-dialog-has-title", ref(false));
</script>

<template>
  <p v-if="api.open" role="status">Opened</p>
  <slot />
</template>
