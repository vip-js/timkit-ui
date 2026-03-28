<script setup lang="ts">
import { cn, toastVariants, type ToastVariants } from "@timui/core";
import { computed, provide, type HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    class?: HTMLAttributes["class"];
    variant?: ToastVariants["variant"];
    onOpenChange?: (open: boolean) => void;
    onPause?: () => void;
    onResume?: () => void;
  }>(),
  {
    variant: "default",
  }
);

const emit = defineEmits(["update:open", "openChange", "pause", "resume"]);

const computedClass = computed(() => cn(toastVariants({ variant: props.variant }), props.class));

const close = () => {
  props.onOpenChange?.(false);
  emit("update:open", false);
  emit("openChange", false);
};

const handlePause = () => {
  props.onPause?.();
  emit("pause");
};

const handleResume = () => {
  props.onResume?.();
  emit("resume");
};

provide("toast", { close });
</script>

<template>
  <li
    v-if="props.open !== false"
    :data-state="props.open ? 'open' : 'closed'"
    :class="computedClass"
    @mouseenter="handlePause"
    @mouseleave="handleResume"
    @focusin="handlePause"
    @focusout="handleResume"
  >
    <slot />
  </li>
</template>
