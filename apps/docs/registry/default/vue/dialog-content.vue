<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogCloseVariants,
  cn,
} from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const api = inject("dialog") as any;
</script>

<template>
  <Teleport to="body">
    <div
      v-if="api.open"
      v-bind="api.backdropProps"
      data-slot="dialog-overlay"
      :class="cn(dialogOverlayVariants())"
    />
    <div v-if="api.open" v-bind="api.positionerProps" class="fixed inset-0 z-50 flex items-center justify-center">
      <div
        v-bind="api.contentProps"
        data-slot="dialog-content"
        :class="cn(dialogContentVariants(), props.class)"
      >
        <slot />

        <button
          v-bind="api.closeTriggerProps"
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
            class="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
