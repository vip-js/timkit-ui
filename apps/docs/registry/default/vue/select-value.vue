<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: string; placeholder?: string }>();
const api = inject("select") as any;
const selectItems = inject("selectItems") as { itemLabels?: { value?: Record<string, string> } } | undefined;

const displayValue = computed(() => {
  const rawValue = api.value?.value;
  const values = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];
  if (values.length === 0) return props.placeholder;

  const labels = selectItems?.itemLabels?.value ?? {};
  const fallback = values.map((value: string) => labels[value] ?? value).join(", ");
  const hasRegisteredLabel = values.some((value: string) => labels[value] !== undefined);
  const valueAsString = api.value?.valueAsString;
  const resolved = hasRegisteredLabel ? fallback : valueAsString || fallback;
  return resolved || props.placeholder;
});
</script>

<template>
  <span :class="cn('pointer-events-none data-[placeholder]:text-muted-foreground', props.class)">
    <slot>
      {{ displayValue }}
    </slot>
  </span>
</template>
