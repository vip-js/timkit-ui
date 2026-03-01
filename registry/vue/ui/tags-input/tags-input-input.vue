<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tagsInputContextKey } from '../../lib/injection-keys'

const tagsInputInputVariants = cva('flex-1 bg-transparent outline-none placeholder:text-muted-foreground')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tagsInputContextKey);
const inputProps = computed(() => api?.value?.getInputProps?.() ?? {});
</script>

<template>
  <input v-bind="inputProps" data-slot="tags-input-input" :class="cn(tagsInputInputVariants(), props.class)" />
</template>
