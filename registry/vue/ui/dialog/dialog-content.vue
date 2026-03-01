<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import DialogOverlay from "./dialog-overlay.vue";
import { dialogContextKey } from '../../lib/injection-keys'

const dialogContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)
const dialogCloseVariants = cva(
    'ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(dialogContextKey);
</script>

<template>
  <Teleport to="body">
    <DialogOverlay />
    <div v-if="api?.open" v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()" :class="cn(dialogContentVariants(), props.class)">
        <slot />
        <button v-bind="api.getCloseTriggerProps()" :class="dialogCloseVariants()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
