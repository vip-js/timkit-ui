<script setup lang="ts">
import { computed, inject, provide, ref, useAttrs, type ComputedRef, type HTMLAttributes } from "vue";
import { cn, tabsListVariants } from "@timui/core";
import { useTabsContext } from "./use-tabs-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const attrs = useAttrs();
const ariaLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' && attrs['aria-label'] ? attrs['aria-label'] : 'Tabs'
);
const api = useTabsContext();
const registered = ref<string[]>([]);
const registerTab = (value: string) => {
  if (registered.value.includes(value)) return;
  registered.value = [...registered.value, value];
};
provide("tabs-register", registerTab);
const tabStatus = computed(() => {
  const active = api.value.value;
  const index = active == null || active === "" ? -1 : registered.value.indexOf(String(active));
  return index < 0 ? "" : `Tab ${index + 1} of ${registered.value.length}`;
});
const groupDisabled = inject<ComputedRef<boolean>>("tabs-disabled", computed(() => false));
const listProps = computed(() => {
  const next = { ...(api.value.getListProps?.() ?? {}) } as Record<string, unknown>;
  delete next.onKeydown;
  return next;
});
const handleKeyDown = (event: KeyboardEvent) => {
  if (groupDisabled.value) {
    event.preventDefault();
    return;
  }
  const zag = (api.value.getListProps?.() ?? {}).onKeydown;
  if (typeof zag === "function") zag(event);
  const list = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  if (!list) return;
  const horizontal = list.getAttribute("data-orientation") !== "vertical";
  const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
  const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
  const triggers = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')];
  if (event.key === "Home" || event.key === "End") {
    const edge = event.key === "Home" ? triggers[0] : triggers[triggers.length - 1];
    const value = edge?.dataset.value;
    if (value) api.value.setValue?.(value);
    return;
  }
  if (event.key !== nextKey && event.key !== prevKey) return;
  const selected = triggers.findIndex((node) => node.getAttribute("aria-selected") === "true");
  if (selected < 0 || triggers.length === 0) return;
  const delta = event.key === nextKey ? 1 : -1;
  const value = triggers[(selected + delta + triggers.length) % triggers.length]?.dataset.value;
  if (value) api.value.setValue?.(value);
};
</script>

<template>
  <div
    v-bind="listProps"
    @keydown="handleKeyDown"
    :aria-label="ariaLabel"
    data-slot="tabs-list"
    :class="
      cn(tabsListVariants(), props.class)
    "
  >
    <p v-if="tabStatus" role="status">{{ tabStatus }}</p>
    <slot />
  </div>
</template>
