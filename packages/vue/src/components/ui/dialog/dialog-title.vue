<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { useDialogContext } from "./use-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useDialogContext();
</script>

<template>
  <h2
    v-bind="api.getTitleProps()"
    data-slot="dialog-title"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </h2>
</template>
