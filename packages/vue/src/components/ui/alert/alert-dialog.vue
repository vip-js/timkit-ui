<script setup lang="ts">
import { useAlertDialog, type UseAlertDialogProps, type UseAlertDialogEmits } from "../alert-dialog/use-alert-dialog";
import { provideAlertDialogContext } from "../alert-dialog/use-alert-dialog-context";

const props = defineProps<UseAlertDialogProps>();
const emit = defineEmits<UseAlertDialogEmits>();

const api = useAlertDialog(props, emit);
provideAlertDialogContext(api);
</script>

<template>
  <slot />
</template>
