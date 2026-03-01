<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { sheetContextKey } from '../../lib/injection-keys'

const sheetDescriptionVariants = cva('text-muted-foreground text-sm')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(sheetContextKey);
</script>

<template>
  <p v-bind="api.getDescriptionProps()" :class="cn(sheetDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
