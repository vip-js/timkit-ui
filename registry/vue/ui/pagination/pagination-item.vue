<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <li :class="cn('', props.class)">
    <slot />
  </li>
</template>
