<script setup lang="ts">
import { type HTMLAttributes, useAttrs } from "vue";
import { type VariantProps } from "class-variance-authority";
import { cn, buttonVariants } from "@/lib/utils";
import { Primitive } from "./primitive";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    isActive?: boolean;
    size?: VariantProps<typeof buttonVariants>["size"];
    as?: string;
    asChild?: boolean;
  }>(),
  {
    as: "a",
    size: "icon",
  }
);

const attrs = useAttrs();
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="attrs"
    :aria-current="props.isActive ? 'page' : undefined"
    :data-active="props.isActive || undefined"
    :class="
      cn(
        buttonVariants({
          variant: props.isActive ? 'outline' : 'ghost',
          size: props.size,
        }),
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
