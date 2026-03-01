<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    :class="
      cn(
        'overflow-hidden p-1 text-foreground [&_[data-radix-combobox-group-label]]:px-2 [&_[data-radix-combobox-group-label]]:py-1.5 [&_[data-radix-combobox-group-label]]:text-xs [&_[data-radix-combobox-group-label]]:font-medium [&_[data-radix-combobox-group-label]]:text-muted-foreground',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
