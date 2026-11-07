<script setup lang="ts">
import { ref, watch, type HTMLAttributes } from "vue";
import type { BannerProps } from "@timui/core";
import { bannerVariants, cn } from "@timui/core";
import { usePassedProp } from "../../../hooks/passed-prop";

type BannerViewProps = Omit<BannerProps, "onOpenChange"> & {
  class?: HTMLAttributes["class"];
  open?: boolean | null;
  defaultOpen?: boolean | null;
};

const props = withDefaults(defineProps<BannerViewProps>(), {
  dismissible: false,
  variant: "default",
});
const emit = defineEmits<{ close: []; openChange: [open: boolean] }>();
const passed = usePassedProp();
const passedOpen = () => passed<boolean | null>(props, "open");
const open = ref(passedOpen() == null ? passed<boolean | null>(props, "defaultOpen") !== false : passedOpen() === true);

watch(
  () => passedOpen(),
  (value) => {
    if (value == null) return;
    open.value = value === true;
  }
);

const close = () => {
  if (!props.dismissible || !open.value) return;
  if (passedOpen() == null) open.value = false;
  emit("openChange", false);
  emit("close");
};
</script>

<template>
  <div
    v-if="open"
    data-slot="banner"
    data-state="open"
    :data-variant="props.variant"
    role="status"
    :class="cn(bannerVariants(), props.class)"
  >
    <slot />
    <button
      v-if="props.dismissible"
      type="button"
      data-slot="banner-close"
      aria-label="Close"
      @click="close"
    >
      ×
    </button>
  </div>
</template>
