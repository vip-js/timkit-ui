<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, type HTMLAttributes, type Ref } from "vue";
import { cn } from "@timui/core";
import { useDialogContext } from "./use-dialog-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useDialogContext();
const hasTitle = inject<Ref<boolean>>("dialog-has-title");
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
    data-slot="dialog-title"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </h2>
</template>
