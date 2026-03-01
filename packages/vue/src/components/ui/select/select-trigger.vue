<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { computed, inject, type Component, type HTMLAttributes, type Ref } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { cn, selectTriggerIconVariants, selectTriggerVariants } from "@timui/core";
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
type SelectApi = {
  triggerProps?: Record<string, BindValue>;
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const triggerProps = computed(() => api?.value?.triggerProps || {});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="triggerProps"
    :class="
      cn(
        selectTriggerVariants(),
        props.class
      )
    "
  >
    <slot />
    <ChevronDownIcon :class="selectTriggerIconVariants()" />
  </Primitive>
</template>
