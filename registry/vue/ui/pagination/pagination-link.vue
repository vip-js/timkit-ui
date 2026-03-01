<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
// We need button variants here.
// Assuming buttonVariants are available globally or we should reuse from button component?
// In standard shadcn-vue, it imports buttonVariants from ui/button.
// We should import it from our local button component or inline it if we want ZERO deps.
// But core Button variants are huge.
// Implementation-wise, we might just assume user has button component?
// Or we import from @timui/core? The goal is to remove @timui/core dependency.
// I will inline a simplified version or the `ghost` variant needed for pagination, OR import from `../button` if I can assume it exists.
// `../button` exists in registry.
// But `button` in registry might not export `buttonVariants`.
// I'll inline the relevant button styles here for safety and zero-dependency, or just minimal styles.
// Actually, Pagination Link usually looks like a button.

const paginationLinkVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const props = withDefaults(defineProps<{
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  class?: HTMLAttributes["class"];
}>(), {
  isActive: false,
  size: "icon",
});

const computedClass = computed(() =>
  cn(
    paginationLinkVariants({
      variant: props.isActive ? "outline" : "ghost",
      size: props.size,
    }),
    props.class
  )
);
</script>

<template>
  <a
    aria-current="page"
    :class="computedClass"
  >
    <slot />
  </a>
</template>
