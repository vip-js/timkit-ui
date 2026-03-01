<script setup lang="ts">
import { type HTMLAttributes } from "vue";
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

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const api = useDialogContext();
</script>

<template>
  <Teleport to="body">
    <Presence
      :present="api?.open ?? false"
      :unmountOnExit="true"
      v-bind="api?.getBackdropProps?.()"
      data-slot="dialog-overlay"
      data-state="open"
      :class="cn(dialogOverlayVariants())"
    />
    <Presence
      :present="api?.open ?? false"
      :unmountOnExit="true"
      v-bind="api?.getPositionerProps?.()"
      :class="cn(dialogPositionerVariants())"
    >
      <div
        v-bind="api?.getContentProps?.()"
        data-slot="dialog-content"
        data-state="open"
        :class="cn(dialogContentVariants(), props.class)"
      >
        <slot />

        <button
          v-bind="api?.getCloseTriggerProps?.()"
          data-slot="dialog-close"
          :class="cn(dialogCloseVariants())"
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
