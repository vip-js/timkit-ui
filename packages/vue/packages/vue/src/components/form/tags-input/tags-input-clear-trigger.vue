<script setup lang="ts">
import { computed, inject } from "vue";
import { cn, tagsInputClearVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("tags-input") as { value?: any };
const clearProps = computed(() => api?.value?.getClearTriggerProps?.() ?? {});
</script>

<template>
  <button v-bind="clearProps" type="button" data-slot="tags-input-clear" :class="cn(tagsInputClearVariants(), props.class)">
    <slot>Clear</slot>
  </button>
</template>
