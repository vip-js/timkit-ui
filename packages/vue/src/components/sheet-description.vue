<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from "radix-vue";
import { cn, sheetDescriptionVariants } from "@timui/shared";

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <DialogDescription
    v-bind="forwarded"
    :class="cn(sheetDescriptionVariants(), props.class)"
  >
    <slot />
  </DialogDescription>
</template>
