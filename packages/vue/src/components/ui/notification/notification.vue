<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";
import type { NotificationProps } from "@timui/core";
import { cn, notificationVariants } from "@timui/core";
import { usePassedProp } from "../../../hooks/passed-prop";

type NotificationViewProps = Omit<NotificationProps, "onOpenChange"> & {
  class?: HTMLAttributes["class"];
  open?: boolean | null;
  defaultOpen?: boolean | null;
};

const props = withDefaults(defineProps<NotificationViewProps>(), {
  closable: true,
  duration: 5000,
  variant: "default",
});
const emit = defineEmits<{ close: []; openChange: [open: boolean] }>();
const passed = usePassedProp();
const passedOpen = () => passed<boolean | null>(props, "open");
const open = ref(passedOpen() == null ? passed<boolean | null>(props, "defaultOpen") !== false : passedOpen() === true);
let timer: ReturnType<typeof setTimeout> | undefined;

const close = () => {
  if (!open.value) return;
  if (passedOpen() == null) open.value = false;
  if (timer) clearTimeout(timer);
  emit("openChange", false);
  emit("close");
};

const arm = () => {
  if (timer) clearTimeout(timer);
  if (!open.value || !props.duration || props.duration <= 0) return;
  timer = setTimeout(close, props.duration);
};

watch(
  () => passedOpen(),
  (value) => {
    if (value == null) return;
    open.value = value === true;
  }
);

watch([() => props.duration, open], arm, { immediate: true });
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div
    v-if="open"
    data-slot="notification"
    data-state="open"
    :data-variant="props.variant"
    role="status"
    :class="cn(notificationVariants(), props.class)"
  >
    <slot />
    <button
      v-if="props.closable"
      type="button"
      data-slot="notification-close"
      aria-label="Close"
      @click="close"
    >
      ×
    </button>
  </div>
</template>
