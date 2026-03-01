<script setup lang="ts">
import { computed, inject } from "vue";
import { avatarFallbackVariants } from "@timui/core";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: string }>();
const api = inject("avatar") as { state: any };
const isLoaded = computed(() => api.state.value.context.loaded);
</script>

<template>
  <div
    v-if="!isLoaded"
    data-slot="avatar-fallback"
    :class="cn(avatarFallbackVariants(), props.class)"
  >
    <slot />
  </div>
</template>
