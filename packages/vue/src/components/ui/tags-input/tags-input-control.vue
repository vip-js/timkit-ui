<script setup lang="ts">
import { computed } from "vue";
import { cn, tagsInputControlVariants } from "@timui/core";
import { useTagsInputContext } from "./use-tags-input-context";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useTagsInputContext();
const controlProps = computed(() => api.value.getControlProps?.() ?? {});
</script>

<template>
  <div v-bind="controlProps" data-slot="tags-input-control" :class="cn(tagsInputControlVariants(), props.class)">
    <slot />
  </div>
</template>
