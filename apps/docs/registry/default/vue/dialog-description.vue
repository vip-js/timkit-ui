<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cn, dialogDescriptionVariants } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject("dialog") as any;
</script>

<template>
  <p
    v-bind="api.descriptionProps"
    data-slot="dialog-description"
    :class="cn(dialogDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
