<script setup lang="ts">
import { computed } from "vue";
import { cn, tagsInputInputVariants } from "@timui/core";
import { useTagsInputContext } from "./use-tags-input-context";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useTagsInputContext();
const inputProps = computed(() => api.value.getInputProps?.() ?? {});
</script>

<template>
  <input v-bind="inputProps" data-slot="tags-input-input" :class="cn(tagsInputInputVariants(), props.class)" />
</template>
