<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { selectContextKey } from '../../lib/injection-keys'

const selectItemVariants = cva(
    'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 ps-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)

const props = defineProps<{ item: any; class?: HTMLAttributes["class"] }>();
const api = inject(selectContextKey);

const itemState = computed(() => api.value.getItemState({ item: props.item }));
</script>

<template>
  <div v-bind="api.getItemProps({ item: props.item })" :class="cn(selectItemVariants(), props.class)">
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center" v-if="itemState.selected">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    <slot>
      <span class="truncate">{{ item.label }}</span>
    </slot>
  </div>
</template>
