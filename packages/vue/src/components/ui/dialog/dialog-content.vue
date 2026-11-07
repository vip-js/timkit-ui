<script setup lang="ts">
import { computed, inject, ref, useAttrs, type ComputedRef, type HTMLAttributes, type Ref } from "vue";
import {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogCloseVariants,
  dialogCloseIconVariants,
  dialogPositionerVariants,
  cn,
} from "@timui/core";
import { useDialogContext } from "./use-dialog-context";
import Presence from "../presence/presence.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const api = useDialogContext();
const attrs = useAttrs();
const modal = inject<ComputedRef<boolean>>("dialog-modal", computed(() => true));
const open = computed(() => api.value.open);
const backdropProps = computed(() => api.value.getBackdropProps());
const positionerProps = computed(() => api.value.getPositionerProps());
const contentProps = computed(() => api.value.getContentProps());
const hasTitle = inject<Ref<boolean>>("dialog-has-title", ref(false));
const label = computed(() => {
  if (hasTitle.value) return undefined;
  const passed = attrs["aria-label"];
  return typeof passed === "string" && passed ? passed : "Dialog";
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
      v-if="modal"
      :present="open"
      :unmountOnExit="true"
      v-bind="backdropProps"
      data-slot="dialog-overlay"
      data-state="open"
      :class="cn(dialogOverlayVariants())"
    />
    <Presence
      :present="open"
      :unmountOnExit="true"
      v-bind="positionerProps"
      :class="cn(dialogPositionerVariants())"
    >
      <div
        v-bind="contentProps"
        :aria-label="label"
        data-slot="dialog-content"
        data-state="open"
        :aria-modal="modal ? 'true' : 'false'"
        :class="cn(dialogContentVariants(), props.class)"
      >
        <slot />

        <button
          v-bind="closeProps"
          data-slot="dialog-close"
          :class="cn(dialogCloseVariants())"
          @click="onClose"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="dialogCloseIconVariants()"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Presence>
  </Teleport>
</template>
