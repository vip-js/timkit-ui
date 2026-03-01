<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { selectContextKey } from '../../lib/injection-keys'

const selectValueVariants = cva(
    'line-clamp-1 pointer-events-none data-[placeholder]:text-muted-foreground'
)

const props = defineProps<{ placeholder?: string; class?: HTMLAttributes["class"] }>();
const api = inject(selectContextKey);
</script>

<template>
  <span :class="cn(selectValueVariants(), props.class)">
    {{ api.valueAsString || props.placeholder }}
  </span>
</template>
