<script setup lang="ts">
import { inject } from "vue";
import { XIcon } from "lucide-vue-next";
import { cn, toastCloseVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const toast = inject("toast") as { close?: () => void } | null;
</script>

<template>
  <button
    type="button"
    aria-label="Close"
    :class="
      cn(
        toastCloseVariants(),
        props.class
      )
    "
    @click="toast?.close?.()"
  >
    <XIcon aria-hidden="true" class="h-4 w-4" />
  </button>
</template>
