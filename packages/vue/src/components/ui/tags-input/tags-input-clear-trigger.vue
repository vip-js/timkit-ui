<script setup lang="ts">
import { computed } from "vue";
import { cn, tagsInputClearVariants } from "@timui/core";
import { useTagsInputContext } from "./use-tags-input-context";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useTagsInputContext();
const clearProps = computed(() => api.value.getClearTriggerProps?.() ?? {});
</script>

<template>
  <button v-bind="clearProps" type="button" data-slot="tags-input-clear" :class="cn(tagsInputClearVariants(), props.class)">
    <slot>Clear</slot>
  </button>
</template>
