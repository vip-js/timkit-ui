<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import {
  cn,
  dialogContentVariants,
  dialogOverlayVariants,
  dialogPositionerVariants,
} from "@timui/core";
import { useAlertDialogContext } from "./use-alert-dialog-context";
import Presence from "../presence/presence.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = useAlertDialogContext();
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
      data-state="open"
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
        data-state="open"
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
