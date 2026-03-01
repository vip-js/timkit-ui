<script setup lang="ts">
import { cn, cardDescriptionVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <p :class="cn(cardDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
