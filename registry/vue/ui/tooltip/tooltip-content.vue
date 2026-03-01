<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { tooltipContextKey } from '../../lib/injection-keys'

const tooltipContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md'
)

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const api = inject(tooltipContextKey);
</script>

<template>
  <Teleport to="body">
    <div v-if="api?.open" v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()" :class="cn(tooltipContentVariants(), props.class)">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
