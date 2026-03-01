<script setup lang="ts">
import { computed, inject } from "vue";
import { X } from "lucide-vue-next";
import { type VariantProps } from "class-variance-authority";
import { sheetContentVariants, sheetOverlayVariants, cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: string;
    side?: VariantProps<typeof sheetContentVariants>["side"];
  }>(),
  {
    side: "right",
  }
);

const api = inject("sheet") as any;
const isOpen = computed(() => api.value?.open);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" v-bind="api.value?.backdropProps" :class="cn(sheetOverlayVariants())" />
    <div v-if="isOpen" v-bind="api.value?.positionerProps" class="fixed inset-0 z-50">
      <div v-bind="api.value?.contentProps" :class="cn(sheetContentVariants({ side: props.side }), props.class)">
        <slot />
        <button
          v-bind="api.value?.closeTriggerProps"
          :class="
            cn(
              'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
            )
          "
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
