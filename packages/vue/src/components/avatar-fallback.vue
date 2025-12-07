<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { AvatarFallback, type AvatarFallbackProps } from "radix-vue";
import { cn } from "@timui/shared";

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <AvatarFallback
    v-bind="delegatedProps"
    :class="cn('bg-secondary flex size-full items-center justify-center rounded-[inherit] text-xs', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
