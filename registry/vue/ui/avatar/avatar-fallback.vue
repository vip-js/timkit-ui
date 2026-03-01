<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { avatarContextKey } from '../../lib/injection-keys'

const avatarFallbackVariants = cva(
    'bg-muted flex h-full w-full items-center justify-center rounded-full'
)

const props = defineProps<{ delayMs?: number; class?: HTMLAttributes["class"] }>();
const api = inject(avatarContextKey);
</script>

<template>
  <span
    v-bind="api.getFallbackProps()"
    :class="cn(avatarFallbackVariants(), props.class)"
  >
    <slot />
  </span>
</template>
