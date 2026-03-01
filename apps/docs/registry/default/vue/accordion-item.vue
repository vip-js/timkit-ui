<script setup lang="ts">
import { inject, provide, computed, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ value: string; class?: HTMLAttributes["class"]; disabled?: boolean }>();
const api = inject("accordion") as any;

const itemState = computed(() =>
  api.value?.getItemState({ value: props.value, disabled: props.disabled })
);
const isOpen = computed(() => itemState.value?.expanded ?? false);
const itemProps = computed(() =>
  api.value?.getItemProps({ value: props.value, disabled: props.disabled }) || {}
);

provide(
  "accordion-item",
  computed(() => ({
    value: props.value,
    disabled: itemState.value?.disabled ?? false,
    isOpen: isOpen.value,
  }))
);
</script>

<template>
  <div
    v-bind="itemProps"
    data-slot="accordion-item"
    :data-state="isOpen ? 'open' : 'closed'"
    :class="cn('border-b last:border-b-0', props.class)"
  >
    <slot />
  </div>
</template>
