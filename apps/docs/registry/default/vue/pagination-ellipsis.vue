<script setup lang="ts">
import { type HTMLAttributes, useAttrs } from "vue";
import { MoreHorizontal } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
</script>

<template>
  <span
    v-bind="attrs"
    aria-hidden="true"
    :class="cn('flex h-9 w-9 items-center justify-center', props.class)"
  >
    <slot>
      <MoreHorizontal class="h-4 w-4" />
      <span class="sr-only">More pages</span>
    </slot>
  </span>
</template>
