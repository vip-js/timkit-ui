<script setup lang="ts">
import { computed, inject, watch, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }>(),
  {
    side: "bottom",
    align: "center",
    sideOffset: 4,
  }
);
const api = inject("dropdown-menu") as any;
const placement = computed(() =>
  props.align === "center" ? props.side : `${props.side}-${props.align}`
);
const positionerProps = computed(() => api?.value?.getPositionerProps?.() ?? {});
const contentProps = computed(() => api?.value?.getContentProps?.() ?? {});

watch(
  () => [placement.value, props.sideOffset],
  () => {
    api?.value?.reposition?.({ placement: placement.value, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="api?.value?.open" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="dropdown-menu-content"
        :class="
          cn(
            'z-50 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class
          )
        "
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
