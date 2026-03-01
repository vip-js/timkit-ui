<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tabsContextKey } from '../../lib/injection-keys'

const tabsListVariants = cva(
    'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tabsContextKey);
</script>

<template>
  <div v-bind="api.getListProps()" :class="cn(tabsListVariants(), props.class)">
    <slot />
  </div>
</template>
