<script setup lang="ts">
import { inject } from "vue";
import { XIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const toast = inject("toast") as { close?: () => void } | null;
</script>

<template>
  <button
    :class="
      cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        props.class
      )
    "
    @click="toast?.close?.()"
  >
    <XIcon class="h-4 w-4" />
  </button>
</template>
