<script setup lang="ts">
import { computed, inject, useAttrs, type HTMLAttributes } from "vue";
import { cn, buttonVariants } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
const api = inject("alert-dialog") as any;

const actionAttrs = computed(() => {
  const { onClick, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const handleClick = (event: MouseEvent) => {
  api.value?.setOpen(false);
  const onClick = (attrs as Record<string, any>).onClick;
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
