<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, type HTMLAttributes, type Ref } from "vue";
import { cn, sheetTitleVariants } from "@timui/core";
import { useSheetContext } from "./use-sheet-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useSheetContext();
const hasTitle = inject<Ref<boolean>>("sheet-has-title");
onMounted(() => {
  if (hasTitle) hasTitle.value = true;
});
onBeforeUnmount(() => {
  if (hasTitle) hasTitle.value = false;
});
</script>

<template>
  <h2
    v-bind="api.getTitleProps()"
    data-slot="sheet-title"
    :class="cn(sheetTitleVariants(), props.class)"
  >
    <slot />
  </h2>
</template>
