<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { commandContextKey } from '../../lib/injection-keys'

const commandInputWrapperVariants = cva('border-input flex items-center border-b px-5')
const commandInputVariants = cva(
    'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50'
)

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const context = inject(commandContextKey);
const api = context.api;
</script>

<template>
  <div :class="commandInputWrapperVariants()" cmdk-input-wrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input
      v-bind="api.getInputProps()"
      :class="cn(commandInputVariants(), props.class)"
    />
  </div>
</template>
