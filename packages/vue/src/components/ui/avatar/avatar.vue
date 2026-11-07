<script setup lang="ts">
import { avatarVariants } from "@timui/core";
import { cn } from '@timui/core';
import { useAvatar } from './use-avatar'
import { provideAvatarContext } from './use-avatar-context'

const props = defineProps<{ class?: string }>();

const api = useAvatar()
provideAvatarContext(api)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    :class="cn(avatarVariants(), props.class)"
  >
    <p v-if="api.status === 'error'" role="status">Unavailable</p>
    <slot />
  </div>
</template>
