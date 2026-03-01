<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tagsInputContextKey } from '../../lib/injection-keys'

const tagsInputClearVariants = cva('text-sm text-muted-foreground hover:text-foreground')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tagsInputContextKey);
const clearProps = computed(() => api?.value?.getClearTriggerProps?.() ?? {});
</script>

<template>
  <button v-bind="clearProps" type="button" data-slot="tags-input-clear" :class="cn(tagsInputClearVariants(), props.class)">
    <slot>Clear</slot>
  </button>
</template>
