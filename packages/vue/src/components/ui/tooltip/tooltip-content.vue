<script setup lang="ts">
import { computed, watch } from "vue";
import { cn, tooltipContentVariants } from "@timui/core";
import { useTooltipContext } from "./use-tooltip-context";
import Presence from "../presence/presence.vue";
import type { Placement } from "@zag-js/popper";

const props = withDefaults(
  defineProps<{
    class?: string;
    sideOffset?: number;
    side?: "top" | "bottom" | "left" | "right";
    showArrow?: boolean;
  }>(),
  {
    sideOffset: 4,
    side: "top",
    showArrow: false,
  }
);

const context = useTooltipContext();
const isOpen = computed(() => context.value.open ?? false);
const positionerProps = computed(() => context.value.getPositionerProps?.() ?? {});
const contentProps = computed(() => context.value.getContentProps?.() ?? {});

watch(
  () => [props.side, props.sideOffset],
  () => {
    context.value.reposition?.({ placement: props.side as Placement, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <Presence :present="isOpen" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="tooltip-content"
        data-state="open"
        :class="
          cn(tooltipContentVariants(), props.showArrow && 'relative', props.class)
        "
      >
        <slot />
        <span
          v-if="props.showArrow"
          data-slot="tooltip-arrow"
          class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-border bg-popover"
        />
      </div>
    </Presence>
  </Teleport>
</template>
