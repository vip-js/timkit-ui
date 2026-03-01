<script setup lang="ts">
import { computed, useAttrs, type HTMLAttributes } from "vue";
import { alertDialogCancelVariants, cn, buttonVariants } from "@timui/core";
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
const api = useAlertDialogContext();

const cancelAttrs = computed(() => {
  const { onClick, ...rest } = attrs as Record<string, object>;
  return rest;
});

const handleClick = (event: MouseEvent) => {
  api.value.setOpen(false);
  const onClick = (attrs as Record<string, object>).onClick as
    | ((event: MouseEvent) => void)
    | undefined;
  onClick?.(event);
};
</script>

<template>
  <button
    v-bind="cancelAttrs"
    type="button"
    :class="cn(buttonVariants({ variant: 'outline' }), alertDialogCancelVariants(), props.class)"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
