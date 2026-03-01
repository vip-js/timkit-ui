<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from '../../primitive';
import { cn, timelineIndicatorVariants } from '@timui/core';

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>();
</script>

<template>
  <Primitive
    data-slot="timeline-indicator"
    :as="as"
    :as-child="asChild"
    :class="cn(timelineIndicatorVariants(), props.class)"
    aria-hidden="true"
  >
    <slot />
  </Primitive>
</template>
