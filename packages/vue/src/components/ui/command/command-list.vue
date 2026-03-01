<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import { useCommandContext } from "./use-command-context";
import { cn, commandListVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = useCommandContext();
const contentProps = computed(() => context?.api.value?.getContentProps?.() || {});
</script>

<template>
  <div v-bind="contentProps" :class="cn(commandListVariants(), props.class)">
    <div role="presentation">
      <slot />
    </div>
  </div>
</template>
