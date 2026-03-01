<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn, tabsListVariants } from "@timui/core";
import { useTabsContext } from "./use-tabs-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useTabsContext();
const listProps = computed(() => api.value.getListProps?.() ?? {});
</script>

<template>
  <div
    v-bind="listProps"
    data-slot="tabs-list"
    :class="
      cn(tabsListVariants(), props.class)
    "
  >
    <slot />
  </div>
</template>
