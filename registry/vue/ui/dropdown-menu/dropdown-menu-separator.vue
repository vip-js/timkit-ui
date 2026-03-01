<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const menuSeparatorVariants = cva('bg-muted -mx-1 my-1 h-px')

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(dropdownMenuContextKey);

const separatorProps = computed(() => api?.value?.getSeparatorProps() ?? {});
</script>

<template>
  <div v-bind="separatorProps" :class="cn(menuSeparatorVariants(), props.class)" />
</template>
