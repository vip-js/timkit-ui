<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { type PrimitiveProps, Primitive } from "radix-vue";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@timui/shared";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] [&>svg]:shrink-0 leading-normal",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "span",
});

const calculatedClass = computed(() => {
  return cn(badgeVariants({ variant: props.variant }), props.class);
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="calculatedClass">
    <slot />
  </Primitive>
</template>
