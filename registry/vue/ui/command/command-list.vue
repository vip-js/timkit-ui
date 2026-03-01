<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { commandContextKey } from '../../lib/injection-keys'

const commandListVariants = cva('max-h-[300px] overflow-y-auto overflow-x-hidden')

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const context = inject(commandContextKey);
const api = context.api;
</script>

<template>
  <div
    v-bind="api.getListProps()"
    :class="cn(commandListVariants(), props.class)"
  >
    <slot />
  </div>
</template>
