<script setup lang="ts">
import { avatarImageVariants, cn } from "@timui/core";
import { useAvatarContext } from "./use-avatar-context";

const props = defineProps<{
  src?: string;
  srcset?: string;
  alt?: string;
  class?: string;
}>();

const api = useAvatarContext();
</script>

<template>
  <img
    v-bind="api.getImageProps()"
    data-slot="avatar-image"
    :src="props.src"
    :srcset="props.srcset"
    :alt="props.alt ?? 'Avatar'"
    :class="cn(avatarImageVariants(), props.class)"
  />
</template>
