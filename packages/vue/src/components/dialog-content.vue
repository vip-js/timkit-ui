<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "radix-vue";
import { X } from "lucide-vue-next";
import {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogCloseVariants,
  cn,
} from "@timui/shared";

const props = defineProps<DialogContentProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :class="cn(dialogOverlayVariants())"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(dialogContentVariants(), props.class)"
    >
      <slot />

      <DialogClose
        :class="cn(dialogCloseVariants())"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
