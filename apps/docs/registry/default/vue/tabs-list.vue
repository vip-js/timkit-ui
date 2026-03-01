<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const context = inject("tabs") as { api: any } | null;
const listProps = computed(() => context?.api.getListProps?.() ?? {});
</script>

<template>
  <div
    v-bind="listProps"
    data-slot="tabs-list"
    :class="
      cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
