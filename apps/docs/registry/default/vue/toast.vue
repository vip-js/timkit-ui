<script setup lang="ts">
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { computed, provide, type HTMLAttributes } from "vue";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ToastVariants = VariantProps<typeof toastVariants>;

const props = withDefaults(
  defineProps<{
    open?: boolean;
    class?: HTMLAttributes["class"];
    variant?: ToastVariants["variant"];
  }>(),
  {
    variant: "default",
  }
);

const emit = defineEmits(["update:open", "openChange"]);

const computedClass = computed(() => cn(toastVariants({ variant: props.variant }), props.class));

const close = () => {
  emit("update:open", false);
  emit("openChange", false);
};

provide("toast", { close });
</script>

<template>
  <li v-if="props.open !== false" :data-state="props.open ? 'open' : 'closed'" :class="computedClass">
    <slot />
  </li>
</template>
