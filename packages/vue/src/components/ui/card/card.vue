<script setup lang="ts">
import { cn, cardVariants, cardHeaderVariants, cardTitleVariants, cardDescriptionVariants, cardContentVariants, cardFooterVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn(cardVariants(), props.class)">
    <slot />
  </div>
</template>

<!-- Note: In Vue, we typically have separate components for sub-parts or use slots with exposing internal components? -->
<!-- The existing card.vue might just be the Root. Where are the others? -->
<!-- If they don't exist, I need to create them. -->
