<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogTitleVariants = cva('text-lg font-semibold')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <h2 v-bind="api.getTitleProps()" :class="cn(alertDialogTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
