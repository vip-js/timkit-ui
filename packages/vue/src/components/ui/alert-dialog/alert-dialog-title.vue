<script setup lang="ts">
import { cn, dialogTitleVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAlertDialogContext();
</script>

<template>
  <h2 v-bind="api.getTitleProps()" :class="cn(dialogTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
