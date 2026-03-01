<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { DialogApi } from "@zag-js/dialog";
import { dialogContextKey } from '../../lib/injection-keys'

const dialogTitleVariants = cva('text-lg font-semibold leading-none tracking-tight')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(dialogContextKey);
</script>

<template>
  <h2 v-bind="api.getTitleProps()" :class="cn(dialogTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
