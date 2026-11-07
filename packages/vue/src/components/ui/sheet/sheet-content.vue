<script setup lang="ts">
import { computed, inject, ref, useAttrs, type HTMLAttributes, type Ref } from "vue";
import { X } from "lucide-vue-next";
import {
  cn,
  sheetCloseIconVariants,
  sheetCloseVariants,
  sheetContentVariants,
  sheetOverlayVariants,
  sheetPositionerVariants,
} from "@timui/core";
import { SheetSideKey, useSheetContext } from "./use-sheet-context";
import Presence from "../presence/presence.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  class?: HTMLAttributes["class"];
  side?: "top" | "right" | "bottom" | "left";
}>();

const api = useSheetContext();
const attrs = useAttrs();
const inheritedSide = inject(SheetSideKey, computed(() => undefined));
const side = computed(() => props.side ?? inheritedSide.value ?? "right");
const open = computed(() => api.value.open);
const backdropProps = computed(() => api.value.getBackdropProps());
const positionerProps = computed(() => api.value.getPositionerProps());
const contentProps = computed(() => api.value.getContentProps());
const hasTitle = inject<Ref<boolean>>("sheet-has-title", ref(false));
const label = computed(() => {
  if (hasTitle.value) return undefined;
  const passed = attrs["aria-label"];
  return typeof passed === "string" && passed ? passed : "Sheet";
});
const closeProps = computed(() => {
  const props = api.value.getCloseTriggerProps();
  const { onClick: _onClick, ...rest } = props;
  return rest;
});
const onClose = (event: MouseEvent) => {
  const click = api.value.getCloseTriggerProps().onClick as ((event: MouseEvent) => void) | undefined;
  click?.(event);
  if (api.value.open) api.value.setOpen(false);
};
</script>

<template>
  <Teleport to="body">
    <Presence
      :present="open"
      lazyMount
      unmountOnExit
      v-bind="backdropProps"
      :class="cn(sheetOverlayVariants())"
    />
    <Presence
      :present="open"
      lazyMount
      unmountOnExit
      v-bind="positionerProps"
      :class="cn(sheetPositionerVariants())"
    >
      <div
        v-bind="contentProps"
        :aria-label="label"
        data-slot="sheet-content"
        :class="cn(sheetContentVariants({ side: side }), props.class)"
      >
        <slot />
        <button
          v-bind="closeProps"
          data-slot="sheet-close"
          :class="cn(sheetCloseVariants())"
          @click="onClose"
        >
          <X aria-hidden="true" :class="sheetCloseIconVariants()" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Presence>
  </Teleport>
</template>
