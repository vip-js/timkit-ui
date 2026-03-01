<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { collapsibleContextKey } from '../../lib/injection-keys'

const collapsibleContentVariants = cva(
    'overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(collapsibleContextKey);
</script>

<template>
  <div v-bind="api.getContentProps()" :class="cn(collapsibleContentVariants(), props.class)">
    <slot />
  </div>
</template>
