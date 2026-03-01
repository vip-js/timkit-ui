<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const breadcrumbLinkVariants = cva('transition-colors hover:text-foreground')

const props = defineProps<{ asChild?: boolean; href?: string; class?: HTMLAttributes["class"] }>();
</script>

<template>
  <a
    v-if="!asChild"
    :href="href"
    :class="cn(breadcrumbLinkVariants(), props.class)"
  >
    <slot />
  </a>
  <slot v-else />
</template>
