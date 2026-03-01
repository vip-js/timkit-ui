<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tabsContextKey } from '../../lib/injection-keys'

const tabsContentVariants = cva(
    'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)

const props = defineProps<{ value: string; class?: HTMLAttributes["class"] }>();
const api = inject(tabsContextKey);
</script>

<template>
  <div v-bind="api.getContentProps({ value: props.value })" :class="cn(tabsContentVariants(), props.class)">
    <slot />
  </div>
</template>
