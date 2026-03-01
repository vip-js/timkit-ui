<script setup lang="ts">
import { computed, inject, watch } from "vue";
import { cn } from "@timui/core";

const props = withDefaults(
  defineProps<{ class?: string; sideOffset?: number; side?: "top" | "bottom" | "left" | "right" }>(),
  {
    sideOffset: 4,
    side: "top",
  }
);

const context = inject("tooltip") as { api: any } | null;
const isOpen = computed(() => context?.api.open ?? false);
const positionerProps = computed(() => context?.api.getPositionerProps?.() ?? {});
const contentProps = computed(() => context?.api.getContentProps?.() ?? {});

watch(
  () => props.sideOffset,
  () => {
    context?.api.reposition?.({ placement: props.side, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="tooltip-content"
        data-state="open"
        :class="
          cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class
          )
        "
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
