<script setup lang="ts">
import { computed, inject, watch } from "vue";
import { avatarImageVariants } from "@timui/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  src?: string;
  srcset?: string;
  alt?: string;
  class?: string;
}>();

const api = inject("avatar") as { state: any; send: (evt: any) => void };

const hasError = computed(() => api.state.value.context.error);

watch(
  () => [props.src, props.srcset],
  ([src, srcset], _, onCleanup) => {
    if (!src) {
      api.send({ type: "ERROR" });
      return;
    }

    const image = new Image();
    image.src = src;
    if (srcset) image.srcset = srcset;

    const onload = () => api.send({ type: "LOADED" });
    const onerror = () => api.send({ type: "ERROR" });

    image.onload = onload;
    image.onerror = onerror;

    if (image.complete) onload();

    onCleanup(() => {
      image.onload = null;
      image.onerror = null;
    });
  },
  { immediate: true }
);
</script>

<template>
  <img
    v-if="!hasError"
    :src="props.src"
    :srcset="props.srcset"
    :alt="props.alt"
    data-slot="avatar-image"
    :class="cn(avatarImageVariants(), props.class)"
  />
</template>
