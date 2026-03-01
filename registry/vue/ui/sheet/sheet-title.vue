<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { sheetContextKey } from '../../lib/injection-keys'

const sheetTitleVariants = cva('text-foreground text-lg font-semibold')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(sheetContextKey);
</script>

<template>
  <h2 v-bind="api.getTitleProps()" :class="cn(sheetTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
