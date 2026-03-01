<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxContentVariants = cva(
    'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md'
)

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const api = inject(comboboxContextKey);
</script>

<template>
  <div v-if="api.open" v-bind="api.getPositionerProps()">
    <div v-bind="api.getContentProps()" :class="cn(comboboxContentVariants(), props.class)">
      <slot />
    </div>
  </div>
</template>
