<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn('relative overflow-hidden', props.class)">
    <div class="h-full w-full rounded-[inherit] overflow-auto">
      <slot />
    </div>
  </div>
</template>
