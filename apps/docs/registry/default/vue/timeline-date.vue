<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "./primitive";
import { cn } from "@/lib/utils";

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
    :class="
      cn(
        'text-muted-foreground mb-1 block text-xs font-medium group-data-[orientation=vertical]/timeline:max-sm:h-4',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
