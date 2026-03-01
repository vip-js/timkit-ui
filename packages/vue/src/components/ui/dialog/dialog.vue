<script setup lang="ts">
import { useDialog, type UseDialogProps, type UseDialogEmits } from "./use-dialog";
import { DialogProvider } from "./use-dialog-context";

const props = defineProps<UseDialogProps>();
const emit = defineEmits<UseDialogEmits>();

const api = useDialog(props, emit);
DialogProvider(api);
</script>

<template>
  <slot />
</template>
