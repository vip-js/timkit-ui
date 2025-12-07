<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { type PrimitiveProps, Primitive } from "radix-vue";
import { type VariantProps } from "class-variance-authority";
import { cn, buttonVariants } from "@timui/shared";

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});

const calculatedClass = computed(() => {
  return cn(buttonVariants({ variant: props.variant, size: props.size }), props.class);
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="calculatedClass">
    <slot />
  </Primitive>
</template>
