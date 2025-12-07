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
import { type VariantProps } from "class-variance-authority";
import {
  sheetContentVariants,
  sheetOverlayVariants,
  cn,
} from "@timui/shared";

interface SheetContentProps extends DialogContentProps {
  class?: HTMLAttributes["class"];
  side?: VariantProps<typeof sheetContentVariants>["side"];
}

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: "right",
});

const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, side, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :class="cn(sheetOverlayVariants())"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(sheetContentVariants({ side }), props.class)"
    >
      <slot />

      <DialogClose
        :class="cn(
          'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary',
        )"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
