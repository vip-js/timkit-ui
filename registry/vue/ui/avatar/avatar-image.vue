<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { avatarContextKey } from '../../lib/injection-keys'

const avatarImageVariants = cva('aspect-square h-full w-full')

const props = defineProps<{ src?: string; alt?: string; class?: HTMLAttributes["class"] }>();
const api = inject(avatarContextKey);
</script>

<template>
  <img
    v-bind="api.getImageProps()"
    :class="cn(avatarImageVariants(), props.class)"
    :src="props.src"
    :alt="props.alt"
  />
</template>
