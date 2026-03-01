<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogDescriptionVariants = cva('text-sm text-muted-foreground')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <p v-bind="api.getDescriptionProps()" :class="cn(alertDialogDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
