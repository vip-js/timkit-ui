<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const menuItemVariants = cva(
    'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)

const props = defineProps<{ value: string; disabled?: boolean; class?: HTMLAttributes["class"] }>();
const api = inject(dropdownMenuContextKey);

const itemProps = computed(() => api?.value?.getItemProps({ value: props.value, disabled: props.disabled }) ?? {});
</script>

<template>
  <div v-bind="itemProps" :class="cn(menuItemVariants(), props.class)">
    <slot />
  </div>
</template>
