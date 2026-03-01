<script setup lang="ts">
import { cn, dialogDescriptionVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAlertDialogContext();
</script>

<template>
  <p v-bind="api.getDescriptionProps()" :class="cn(dialogDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
