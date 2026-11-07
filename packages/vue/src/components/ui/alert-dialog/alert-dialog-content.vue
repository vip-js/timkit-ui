<script setup lang="ts">
import { computed, inject, ref, useAttrs, type HTMLAttributes, type Ref } from "vue";
import {
  cn,
  dialogContentVariants,
  dialogOverlayVariants,
  dialogPositionerVariants,
} from "@timui/core";
import { useAlertDialogContext } from "./use-alert-dialog-context";
import Presence from "../presence/presence.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAlertDialogContext();
const attrs = useAttrs();
const hasTitle = inject<Ref<boolean>>("alert-dialog-has-title", ref(false));
const label = computed(() => {
  if (hasTitle.value) return undefined;
  const passed = attrs["aria-label"];
  return typeof passed === "string" && passed ? passed : "Alert dialog";
});
const overlayProps = computed(() => {
  const { onClick, ...rest } = api.value.getBackdropProps() ?? {};
  return rest;
});
</script>

<template>
  <Teleport to="body">
    <Presence
      :present="api.open"
      lazyMount
      unmountOnExit
      v-bind="overlayProps"
      data-slot="alert-dialog-overlay"
      :class="cn(dialogOverlayVariants())"
    />
    <Presence
      :present="api.open"
      lazyMount
      unmountOnExit
      v-bind="api.getPositionerProps()"
      :class="cn(dialogPositionerVariants())"
    >
      <div
        v-bind="api.getContentProps()"
        :aria-label="label"
        data-slot="alert-dialog-content"
        :class="
          cn(
            dialogContentVariants(),
            props.class
          )
        "
      >
        <slot />
      </div>
    </Presence>
  </Teleport>
</template>
