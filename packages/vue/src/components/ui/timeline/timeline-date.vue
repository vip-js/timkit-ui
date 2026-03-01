<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from '../../primitive';
import { cn, timelineDateVariants } from '@timui/core';

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(),
  {
    as: "time",
  }
);
</script>

<template>
  <Primitive
    data-slot="timeline-date"
    :as="as"
    :as-child="asChild"
    :class="cn(timelineDateVariants(), props.class)"
  >
    <slot />
  </Primitive>
</template>
