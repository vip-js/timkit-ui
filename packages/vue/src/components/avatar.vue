<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { AvatarRoot, type AvatarRootProps } from "radix-vue";
import { cn } from "@timui/shared";

const props = defineProps<AvatarRootProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <AvatarRoot
    v-bind="delegatedProps"
    :class="cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', props.class)"
  >
    <slot />
  </AvatarRoot>
</template>
