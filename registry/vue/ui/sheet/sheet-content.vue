<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import SheetOverlay from "./sheet-overlay.vue";
import { sheetContextKey } from '../../lib/injection-keys'

const sheetContentVariants = cva(
    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    {
        variants: {
            side: {
                top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
                bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
                left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            },
        },
        defaultVariants: {
            side: 'right',
        },
    }
)
const sheetCloseVariants = cva(
    'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
)

type SheetContentProps = {
  class?: HTMLAttributes["class"];
  side?: "top" | "bottom" | "left" | "right";
};

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: "right",
});
const api = inject(sheetContextKey);
</script>

<template>
  <Teleport to="body">
    <SheetOverlay />
    <div v-if="api?.open" v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()" :class="cn(sheetContentVariants({ side: props.side }), props.class)">
        <slot />
        <button v-bind="api.getCloseTriggerProps()" :class="sheetCloseVariants()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
