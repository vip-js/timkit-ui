<script setup lang="ts">
import { ChevronUpIcon } from "lucide-vue-next";
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <slot>
      <ChevronUpIcon class="h-4 w-4" />
    </slot>
  </div>
</template>
