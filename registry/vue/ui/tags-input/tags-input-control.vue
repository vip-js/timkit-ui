<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tagsInputContextKey } from '../../lib/injection-keys'

const tagsInputControlVariants = cva(
    'flex flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tagsInputContextKey);
const controlProps = computed(() => api?.value?.getControlProps?.() ?? {});
</script>

<template>
  <div v-bind="controlProps" data-slot="tags-input-control" :class="cn(tagsInputControlVariants(), props.class)">
    <slot />
  </div>
</template>
