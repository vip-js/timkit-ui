<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("dropdown-menu") as any;
const separatorProps = computed(() => api?.value?.getSeparatorProps?.() ?? {});
</script>

<template>
  <div
    v-bind="separatorProps"
    data-slot="dropdown-menu-separator"
    :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
  >
    <slot />
  </div>
</template>
