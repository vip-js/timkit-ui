<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ value: string; class?: HTMLAttributes["class"] }>();
const context = inject("tabs") as { api: any } | null;
const isSelected = computed(() => context?.api.value === props.value);
const contentProps = computed(() =>
  context?.api.getContentProps?.({ value: props.value }) ?? {},
);
</script>

<template>
  <div
    v-if="isSelected"
    v-bind="contentProps"
    data-slot="tabs-content"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="
      cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
