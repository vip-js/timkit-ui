<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxControlVariants = cva(
    'flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const api = inject(comboboxContextKey);
</script>

<template>
  <div v-bind="api.getControlProps()" :class="cn(comboboxControlVariants(), props.class)">
    <slot />
  </div>
</template>
