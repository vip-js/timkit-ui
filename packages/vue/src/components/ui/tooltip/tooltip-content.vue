<script setup lang="ts">
import { computed, watch } from "vue";
import { cn, tooltipContentVariants } from "@timui/core";
import { useTooltipContext } from "./use-tooltip-context";
import Presence from "../presence/presence.vue";
import type { Placement } from "@zag-js/popper";

const props = withDefaults(
  defineProps<{ class?: string; sideOffset?: number; side?: "top" | "bottom" | "left" | "right" }>(),
  {
    sideOffset: 4,
    side: "top",
  }
);

const context = useTooltipContext();
const isOpen = computed(() => context.value.open ?? false);
const positionerProps = computed(() => context.value.getPositionerProps?.() ?? {});
const contentProps = computed(() => context.value.getContentProps?.() ?? {});

watch(
  () => props.sideOffset,
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
          cn(tooltipContentVariants(), props.class)
        "
      >
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
