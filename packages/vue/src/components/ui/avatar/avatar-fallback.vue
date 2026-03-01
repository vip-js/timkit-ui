<script setup lang="ts">
import { avatarFallbackVariants, cn } from "@timui/core";
import { useAvatarContext } from "./use-avatar-context";

const props = defineProps<{ class?: string }>();

const api = useAvatarContext();
</script>

<template>
  <div
    v-bind="api.getFallbackProps()"
    :class="cn(avatarFallbackVariants(), props.class)"
  >
    <slot />
  </div>
</template>
