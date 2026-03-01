<script setup lang="ts">
import { computed, watch, type HTMLAttributes } from "vue";
import { useMachine } from "@zag-js/vue";
import { progressMachine } from "@timui/core";
import { cn } from "@/lib/utils";

const props = defineProps<{ modelValue?: number | null; max?: number; class?: HTMLAttributes["class"] }>();

const service = useMachine(progressMachine, {
  context: {
    value: props.modelValue ?? null,
    max: props.max ?? 100,
  },
});

const percent = computed(() => {
  const value = service.state.value.context.value;
  const max = service.state.value.context.max ?? 100;
  if (value == null) return 0;
  return Math.round((value / max) * 100);
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== service.state.value.context.value) {
      service.send({ type: "VALUE.SET", value: val });
    }
  }
);
</script>

<template>
  <div
    role="progressbar"
    data-slot="progress"
    :aria-valuemax="props.max ?? 100"
    aria-valuemin="0"
    :aria-valuenow="props.modelValue ?? undefined"
    :data-max="props.max ?? 100"
    :data-value="props.modelValue ?? undefined"
    :data-state="props.modelValue == null ? 'indeterminate' : 'loading'"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)"
  >
    <div
      data-slot="progress-indicator"
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="`transform: translateX(-${100 - percent}%);`"
    />
  </div>
</template>
