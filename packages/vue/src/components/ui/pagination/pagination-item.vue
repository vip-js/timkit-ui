<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn } from '@timui/core';

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <li :class="cn('', props.class)">
    <slot />
  </li>
</template>
