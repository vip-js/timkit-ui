<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxListVariants = cva('max-h-60 overflow-y-auto p-1')

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const api = inject(comboboxContextKey);
</script>

<template>
  <ul v-bind="api.getListProps()" :class="cn(comboboxListVariants(), props.class)">
    <slot />
  </ul>
</template>
