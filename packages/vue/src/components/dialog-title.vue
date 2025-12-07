<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DialogTitle, type DialogTitleProps, useForwardProps } from "radix-vue";
import { cn, dialogTitleVariants } from "@timui/shared";

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <DialogTitle
    v-bind="forwarded"
    :class="cn(dialogTitleVariants(), props.class)"
  >
    <slot />
  </DialogTitle>
</template>
