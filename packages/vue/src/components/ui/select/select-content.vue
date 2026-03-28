<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { computed, inject, type HTMLAttributes, type Ref } from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
import { cn, selectContentPopperVariants, selectContentVariants } from "@timui/core";
import Presence from "../presence/presence.vue";

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; position?: "popper" | "item-aligned" }>(),
  {
    position: "popper",
  }
);

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type SelectApi = {
  open?: boolean;
  getPositionerProps?: () => Record<string, BindValue>;
  getContentProps?: () => Record<string, BindValue>;
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const isOpen = computed(() => api?.value?.open);
const positionerProps = computed(() => api?.value?.getPositionerProps?.() || {});
const contentProps = computed(() => api?.value?.getContentProps?.() || {});
</script>

<template>
  <Teleport to="body">
    <Presence
      :present="isOpen || false"
      :lazyMount="false"
      :unmountOnExit="false"
      v-bind="positionerProps"
      style="z-index: 50"
    >
      <div
        v-bind="contentProps"
        :class="
          cn(
            selectContentVariants(),
            props.position === 'popper' &&
              selectContentPopperVariants(),
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
    </Presence>
  </Teleport>
</template>
