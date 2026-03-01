<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes, type Ref } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    as: "button",
  }
);

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type SheetApi = {
  triggerProps?: Record<string, BindValue>;
};
const api = inject("sheet") as Ref<SheetApi | undefined> | undefined;
const triggerProps = computed(() => api?.value?.triggerProps || {});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="triggerProps"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
