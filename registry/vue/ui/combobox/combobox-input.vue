<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import type * as combobox from "@zag-js/combobox";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxInputVariants = cva('flex-1 bg-transparent outline-none placeholder:text-muted-foreground')

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const api = inject(comboboxContextKey);
</script>

<template>
  <input v-bind="api.getInputProps()" :class="cn(comboboxInputVariants(), props.class)" />
</template>
