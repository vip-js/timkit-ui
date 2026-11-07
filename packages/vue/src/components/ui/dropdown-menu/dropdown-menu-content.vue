<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, provide, ref, watch, type HTMLAttributes, type ComputedRef } from "vue";
import { cn, dropdownMenuContentVariants } from "@timui/core";
import Presence from "../presence/presence.vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }>(),
  {
    side: "bottom",
    align: "center",
    sideOffset: 4,
  }
);
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type DropdownMenuApi = {
  open?: boolean;
  getPositionerProps?: () => Record<string, BindValue>;
  getContentProps?: () => Record<string, BindValue>;
  reposition?: (options: { placement: string; gutter?: number }) => void;
};

const api = useDropdownMenuContext() as ComputedRef<DropdownMenuApi> | undefined;
const placement = computed(() =>
  props.align === "center" ? props.side : `${props.side}-${props.align}`
);
const open = computed(() => Boolean(api?.value?.open));
const registered = ref<string[]>([]);
const registerItem = (value: string) => {
  if (registered.value.includes(value)) return;
  registered.value = [...registered.value, value];
};
provide("menu-register", registerItem);
const itemStatus = computed(() => {
  if (!open.value) return "";
  const highlighted = (api?.value as { highlightedValue?: string } | undefined)?.highlightedValue;
  const index = highlighted ? registered.value.indexOf(highlighted) : -1;
  return index < 0 ? "" : `Item ${index + 1} of ${registered.value.length}`;
});
const positionerProps = computed(() => api?.value?.getPositionerProps?.() ?? {});
const contentProps = computed(() => {
  const next = api?.value?.getContentProps?.() ?? {};
  const previous = (next.onKeydown ?? next.onKeyDown) as ((event: KeyboardEvent) => void) | undefined;
  return {
    ...next,
    onKeydown: (event: KeyboardEvent) => {
      const letter = /^[a-z]$/i.test(event.key);
      if (!letter && typeof previous === "function") previous(event);
      const current = event.currentTarget;
      if (!(current instanceof HTMLElement)) return;
      const items = [...current.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([data-disabled])')];
      const highlight = (value?: string) => {
        if (!value) return;
        (api?.value as { setHighlightedValue?: (next: string) => void } | undefined)?.setHighlightedValue?.(value);
      };
      if (event.key === "Home" || event.key === "End") {
        highlight(items[event.key === "Home" ? 0 : items.length - 1]?.dataset.value);
        return;
      }
      if (!letter) return;
      const active = items.findIndex((item) => item.hasAttribute("data-highlighted"));
      const start = active < 0 ? 0 : active + 1;
      for (let offset = 0; offset < items.length; offset += 1) {
        const index = (start + offset) % items.length;
        if (active >= 0 && index === active) continue;
        const label = items[index]?.textContent?.trim() ?? "";
        if (!label.toLowerCase().startsWith(event.key.toLowerCase())) continue;
        highlight(items[index]?.dataset.value);
        break;
      }
    },
  };
});

watch(
  () => [placement.value, props.sideOffset],
  () => {
    api?.value?.reposition?.({ placement: placement.value, gutter: props.sideOffset });
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <Presence :present="open" :unmountOnExit="true" v-bind="positionerProps" style="z-index: 50">
      <div
        v-bind="contentProps"
        data-slot="dropdown-menu-content"
        :class="
          cn(
            dropdownMenuContentVariants(),
            props.class
          )
        "
      >
        <p v-if="itemStatus" role="status">{{ itemStatus }}</p>
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
