<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const dropdownMenuSubTriggerVariants = cva(
    'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent'
)

const props = defineProps<{
  value?: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const api = inject(dropdownMenuContextKey);

// Note: Zag menu sub-triggers need to point to a submenu.
// This implementation assumes standard Zag pattern.
const triggerProps = computed(() => {
    // This is simplified. True Zag submenu implementation requires more context passing.
    // For now we implement the basic structure.
    return {
        // ...api?.value?.getTriggerProps(...)
    }
});
</script>

<template>
  <div :class="cn(dropdownMenuSubTriggerVariants(), props.class)">
    <slot />
    <svg class="ml-auto h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
  </div>
</template>
