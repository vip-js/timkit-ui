<script setup lang="ts">
import { cn, cardFooterVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn(cardFooterVariants(), props.class)">
    <slot />
  </div>
</template>
