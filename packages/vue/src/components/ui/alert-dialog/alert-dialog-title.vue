<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, type HTMLAttributes, type Ref } from "vue";
import { cn, dialogTitleVariants } from "@timui/core";
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAlertDialogContext();
const hasTitle = inject<Ref<boolean>>("alert-dialog-has-title");
onMounted(() => {
  if (hasTitle) hasTitle.value = true;
});
onBeforeUnmount(() => {
  if (hasTitle) hasTitle.value = false;
});
</script>

<template>
  <h2 v-bind="api.getTitleProps()" data-slot="alert-dialog-title" :class="cn(dialogTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
