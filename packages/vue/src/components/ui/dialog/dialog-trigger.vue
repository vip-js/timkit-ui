<script setup lang="ts">
import { useDialogContext } from "./use-dialog-context";

const api = useDialogContext();
</script>

<template>
  <button v-bind="api.getTriggerProps()" data-slot="dialog-trigger">
    <slot />
  </button>
</template>
