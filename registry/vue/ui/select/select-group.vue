<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { selectContextKey } from '../../lib/injection-keys'

const props = defineProps<{ label?: string; class?: HTMLAttributes["class"] }>();
const api = inject(selectContextKey);
</script>

<template>
  <div v-bind="api.getItemGroupProps({ id: props.label })">
    <div v-bind="api.getItemGroupLabelProps({ htmlFor: props.label })" :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)">
      {{ props.label }}
    </div>
    <slot />
  </div>
</template>
