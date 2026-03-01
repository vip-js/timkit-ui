<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const commandGroupVariants = cva(
    'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'
)

const props = defineProps<{
  heading?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(commandGroupVariants(), props.class)"
    role="presentation"
    :data-value="props.heading"
  >
    <div v-if="props.heading" cmdk-group-heading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ props.heading }}
    </div>
    <slot />
  </div>
</template>
