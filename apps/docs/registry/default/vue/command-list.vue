<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject("command") as any;
const contentProps = computed(() => context?.api.value?.getContentProps?.() || {});
</script>

<template>
  <div v-bind="contentProps" :class="cn('max-h-[300px] overflow-y-auto overflow-x-hidden', props.class)">
    <div role="presentation">
      <slot />
    </div>
  </div>
</template>
