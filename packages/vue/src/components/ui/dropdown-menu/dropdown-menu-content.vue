<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, watch, type HTMLAttributes, type ComputedRef } from "vue";
import { cn, dropdownMenuContentVariants } from "@timui/core";
import Presence from "../presence/presence.vue";

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
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type DropdownMenuApi = {
  open?: boolean;
  getPositionerProps?: () => Record<string, BindValue>;
  getContentProps?: () => Record<string, BindValue>;
  reposition?: (options: { placement: string; gutter?: number }) => void;
};

const api = useDropdownMenuContext() as ComputedRef<DropdownMenuApi> | undefined;
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
    <Presence :present="api?.open ?? false" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="dropdown-menu-content"
        :class="
          cn(
            dropdownMenuContentVariants(),
            props.class
          )
        "
      >
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
