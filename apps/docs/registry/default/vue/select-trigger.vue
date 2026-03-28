<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Primitive } from "./primitive";

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

const api = inject("select") as any;
const triggerProps = computed(() => api.value?.getTriggerProps?.() || {});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="triggerProps"
    :class="
      cn(
        !props.asChild &&
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class
      )
    "
  >
    <slot />
    <ChevronDownIcon v-if="!props.asChild" class="h-4 w-4 opacity-50" />
  </Primitive>
</template>
