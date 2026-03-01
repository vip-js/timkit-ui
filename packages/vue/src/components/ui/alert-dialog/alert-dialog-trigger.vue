<script setup lang="ts">
import { type HTMLAttributes, type Component } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';
import { useAlertDialogContext } from "./use-alert-dialog-context";

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    as: "button",
  }
);

const api = useAlertDialogContext();
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="api.getTriggerProps()"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
