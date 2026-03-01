<script setup lang="ts">
import { provide, computed } from "vue";
import { useMachine, normalizeProps } from "@zag-js/vue";
import * as avatar from "@zag-js/avatar";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { avatarContextKey } from '../../lib/injection-keys'

const avatarRootVariants = cva('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full')
const avatarVariants = avatarRootVariants

const props = defineProps<{ class?: string; id?: string }>();

const service = useMachine(avatar.machine, { id: props.id });
const api = computed(() => avatar.connect(service, normalizeProps));

provide(avatarContextKey, api);
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    data-slot="avatar"
    :class="cn(avatarVariants(), props.class)"
  >
    <slot />
  </div>
</template>
