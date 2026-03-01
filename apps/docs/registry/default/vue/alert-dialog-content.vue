<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("alert-dialog") as any;
const overlayProps = computed(() => {
  const { onClick, ...rest } = api.value?.backdropProps || {};
  return rest;
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="api.open"
      v-bind="overlayProps"
      class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <div
      v-if="api.open"
      v-bind="api.positionerProps"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        v-bind="api.contentProps"
        :class="
          cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
            props.class
          )
        "
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
