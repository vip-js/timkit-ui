<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuListVariants = cva('group flex flex-1 list-none items-center justify-center space-x-1')

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <ul
    data-orientation="horizontal"
    :class="cn(navigationMenuListVariants(), props.class)"
  >
    <slot />
  </ul>
</template>
