<script setup lang="ts">
import { cn, cardHeaderVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn(cardHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
