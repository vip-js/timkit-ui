<script setup lang="ts">
import { cn, toastVariants, type ToastVariants } from "@timui/core";
import { computed, provide, ref, type HTMLAttributes } from "vue";

import { usePassedProp } from "../../../hooks/passed-prop";

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

const passed = usePassedProp();
const dismissed = ref(false);
const visible = computed(() => {
  const open = passed<boolean>(props, "open");
  return open === undefined ? !dismissed.value : open;
});
const computedClass = computed(() => cn(toastVariants({ variant: props.variant }), props.class));

const close = () => {
  dismissed.value = true;
  emit("update:open", false);
  emit("openChange", false);
};

const handlePause = () => {
  emit("pause");
};

const handleResume = () => {
  emit("resume");
};

provide("toast", { close });
</script>

<template>
  <li
    v-if="visible"
    data-slot="toast"
    :data-state="visible ? 'open' : 'closed'"
    :class="computedClass"
    @mouseenter="handlePause"
    @mouseleave="handleResume"
    @focusin="handlePause"
    @focusout="handleResume"
  >
    <p role="status">Opened</p>
    <slot />
  </li>
</template>
