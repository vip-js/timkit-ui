<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { popoverContextKey } from '../../lib/injection-keys'

const popoverContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2px] data-[state=open]:slide-in-from-top-[2px] z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(popoverContextKey);
</script>

<template>
  <Teleport to="body">
    <div v-if="api?.open" v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()" :class="cn(popoverContentVariants(), props.class)">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
