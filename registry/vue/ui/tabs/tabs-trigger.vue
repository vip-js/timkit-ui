<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tabsContextKey } from '../../lib/injection-keys'

const tabsTriggerVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'
)

const props = defineProps<{ value: string; disabled?: boolean; class?: HTMLAttributes["class"] }>();
const api = inject(tabsContextKey);
</script>

<template>
  <button
    v-bind="api.getTriggerProps({ value: props.value, disabled: props.disabled })"
    :class="cn(tabsTriggerVariants(), props.class)"
  >
    <slot />
  </button>
</template>
