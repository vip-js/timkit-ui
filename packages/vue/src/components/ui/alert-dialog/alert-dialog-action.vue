<script setup lang="ts">
import { computed, useAttrs, type HTMLAttributes } from "vue";
import { cn, buttonVariants } from "@timui/core";
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
const api = useAlertDialogContext();

type AttrValue = string | number | boolean | null | undefined | ((event: MouseEvent) => void);

const actionAttrs = computed(() => {
  const { onClick, ...rest } = attrs as Record<string, AttrValue>;
  return rest;
});

const handleClick = (event: MouseEvent) => {
  api.value.setOpen(false);
  const onClick = (attrs as Record<string, AttrValue>).onClick;
  if (typeof onClick !== "function") return;
  onClick?.(event);
};
</script>

<template>
  <button
    v-bind="actionAttrs"
    type="button"
    :class="cn(buttonVariants(), props.class)"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
