<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const commandEmptyVariants = cva('py-6 text-center text-sm')

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn(commandEmptyVariants(), props.class)" cmdk-empty>
    <slot />
  </div>
</template>
