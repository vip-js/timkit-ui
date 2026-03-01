<script setup lang="ts">
import { cn, toastVariants, type ToastVariants } from "@timui/core";
import { computed, provide, type HTMLAttributes } from "vue";

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
