<script setup lang="ts">
import { computed, watch } from "vue";
import { cn, popoverContentVariants } from "@timui/core";
import { usePopoverContext } from "./use-popover-context";
import Presence from "../presence/presence.vue";
import type { Placement } from "@zag-js/popper";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    class?: string;
    align?: "center" | "start" | "end";
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
  }>(),
  {
    align: "center",
    side: "bottom",
    sideOffset: 4,
  }
);

const context = usePopoverContext();
const isOpen = computed(() => context.value.open ?? false);
const positionerProps = computed(() => context.value.getPositionerProps?.() ?? {});
const contentProps = computed(() => context.value.getContentProps?.() ?? {});
const placement = computed(() =>
  props.align === "center" ? props.side : `${props.side}-${props.align}`,
);

watch(
  () => [placement.value, props.sideOffset],
  () => {
    context.value.reposition?.({ placement: placement.value as Placement, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <Presence :present="isOpen" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="popover-content"
        data-state="open"
        :data-align="props.align"
        :class="cn(popoverContentVariants(), props.class)"
      >
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
