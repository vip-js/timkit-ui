<script setup lang="ts">
import { inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive } from "./primitive";

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

const api = inject("alert-dialog") as any;
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="api.triggerProps"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
