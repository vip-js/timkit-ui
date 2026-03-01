<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import AlertDialogOverlay from "./alert-dialog-overlay.vue";
import { alertDialogContextKey } from '../../lib/injection-keys'

const alertDialogContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-[50%] data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-[50%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(alertDialogContextKey);
</script>

<template>
  <Teleport to="body">
    <AlertDialogOverlay />
    <div v-if="api?.open" v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()" :class="cn(alertDialogContentVariants(), props.class)">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
