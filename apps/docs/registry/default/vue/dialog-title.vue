<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("dialog") as any;
</script>

<template>
  <h2
    v-bind="api.titleProps"
    data-slot="dialog-title"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </h2>
</template>
