<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { X } from "lucide-vue-next";
import {
  cn,
  sheetCloseIconVariants,
  sheetCloseVariants,
  sheetContentVariants,
  sheetOverlayVariants,
  sheetPositionerVariants,
} from "@timui/core";
import { useSheetContext } from "./use-sheet-context";
import Presence from "../presence/presence.vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    side?: "top" | "right" | "bottom" | "left";
  }>(),
  { side: "right" }
);

const api = useSheetContext();
const isOpen = computed(() => api.value?.open);
</script>

<template>
  <Teleport to="body">
    <Presence
      :present="api?.open"
      lazyMount
      unmountOnExit
      v-bind="api?.getBackdropProps?.()"
      :class="cn(sheetOverlayVariants())"
    />
    <Presence
      :present="api?.open"
      lazyMount
      unmountOnExit
      v-bind="api?.getPositionerProps?.()"
      :class="cn(sheetPositionerVariants())"
    >
      <div
        v-bind="api?.getContentProps?.()"
        :class="cn(sheetContentVariants({ side: props.side }), props.class)"
      >
        <slot />
        <button
          v-bind="api?.getCloseTriggerProps?.()"
          :class="cn(sheetCloseVariants())"
        >
          <X :class="sheetCloseIconVariants()" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Presence>
  </Teleport>
</template>
