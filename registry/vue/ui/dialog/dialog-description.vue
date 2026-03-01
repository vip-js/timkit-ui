<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dialogContextKey } from '../../lib/injection-keys'

const dialogDescriptionVariants = cva('text-sm text-muted-foreground')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(dialogContextKey);
</script>

<template>
  <p v-bind="api.getDescriptionProps()" :class="cn(dialogDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
