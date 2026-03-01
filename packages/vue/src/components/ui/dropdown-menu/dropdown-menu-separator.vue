<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, inject, type HTMLAttributes, type ComputedRef } from "vue";
import { cn, dropdownMenuSeparatorVariants } from "@timui/core";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type DropdownMenuApi = {
  getSeparatorProps?: () => Record<string, BindValue>;
};
const api = useDropdownMenuContext() as ComputedRef<DropdownMenuApi> | undefined;
const separatorProps = computed(() => api?.value?.getSeparatorProps?.() ?? {});
</script>

<template>
  <div
    v-bind="separatorProps"
    data-slot="dropdown-menu-separator"
    :class="cn(dropdownMenuSeparatorVariants(), props.class)"
  >
    <slot />
  </div>
</template>
