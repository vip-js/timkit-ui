<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuLinkVariants = cva(
    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
)

const props = defineProps<{
  class?: HTMLAttributes["class"]
  href?: string
  active?: boolean
  asChild?: boolean
}>()
</script>

<template>
  <a
    :href="href"
    :data-active="active ? '' : undefined"
    :class="cn(navigationMenuLinkVariants(), props.class)"
  >
    <slot />
  </a>
</template>
