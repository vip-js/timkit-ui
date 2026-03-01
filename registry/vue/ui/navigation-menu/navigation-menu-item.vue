<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuItemVariants = cva('relative')

const props = defineProps<{
  class?: HTMLAttributes["class"]
  value?: string
}>()
</script>

<template>
  <li
    :class="cn(navigationMenuItemVariants(), props.class)"
  >
    <slot />
  </li>
</template>
