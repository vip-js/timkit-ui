<script setup lang="ts">
import { Primitive } from "./primitive";
import type { HTMLAttributes } from "vue";

defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <Primitive as-child v-bind="$attrs">
    <slot />
  </Primitive>
</template>
