<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, dialogDescriptionVariants } from "@timui/core";
import { useDialogContext } from "./use-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useDialogContext();
</script>

<template>
  <p
    v-bind="api.getDescriptionProps()"
    data-slot="dialog-description"
    :class="cn(dialogDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
