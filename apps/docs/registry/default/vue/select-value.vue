<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: string; placeholder?: string }>();
const api = inject("select") as any;
const displayValue = computed(() => api.value?.valueAsString || api.value?.value || props.placeholder);
</script>

<template>
  <span :class="cn('pointer-events-none data-[placeholder]:text-muted-foreground', props.class)">
    <slot>
      {{ displayValue }}
    </slot>
  </span>
</template>
