<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const api = inject(comboboxContextKey);
</script>

<template>
  <button v-bind="api.getTriggerProps()" type="button" :class="cn('opacity-50', props.class)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
  </button>
</template>
