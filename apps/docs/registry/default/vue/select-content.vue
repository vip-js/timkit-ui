<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; position?: "popper" | "item-aligned" }>(),
  {
    position: "popper",
  }
);

const api = inject("select") as any;
const isOpen = computed(() => api.value?.open);
const positionerProps = computed(() => api.value?.getPositionerProps?.() || {});
const contentProps = computed(() => api.value?.getContentProps?.() || {});
</script>

<template>
  <Teleport to="body">
    <div v-show="isOpen" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        :class="
          cn(
            'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            props.class
          )
        "
      >
        <div class="flex cursor-default items-center justify-center py-1">
          <ChevronUpIcon class="h-4 w-4" />
        </div>

        <div
          :class="
            cn(
              'p-1',
              props.position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            )
          "
        >
          <slot />
        </div>

        <div class="flex cursor-default items-center justify-center py-1">
          <ChevronDownIcon class="h-4 w-4" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
