<script setup lang="ts">
import { computed, inject, watch } from "vue";
import { cn, popoverContentVariants } from "@timui/core";

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

const context = inject("popover") as { api: any } | null;
const isOpen = computed(() => context?.api.open ?? false);
const positionerProps = computed(() => context?.api.getPositionerProps?.() ?? {});
const contentProps = computed(() => context?.api.getContentProps?.() ?? {});
const placement = computed(() =>
  props.align === "center" ? props.side : `${props.side}-${props.align}`,
);

watch(
  () => [placement.value, props.sideOffset],
  () => {
    context?.api.reposition?.({ placement: placement.value, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="popover-content"
        data-state="open"
        :data-align="props.align"
        :class="cn(popoverContentVariants(), props.class)"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
