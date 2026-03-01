<script setup lang="ts">
import { inject, computed, type HTMLAttributes, type InjectionKey } from "vue";
import { cva } from "../../lib/cva";
import { cn } from "../../lib/utils";

const navigationMenuTriggerVariants = cva(
    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
)
const navigationMenuTriggerIconVariants = cva('ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180')

interface NavigationMenuContext {
  activeValue: import('vue').Ref<string>
  setValue: (val: string) => void
}

const navigationMenuContextKey: InjectionKey<NavigationMenuContext> = Symbol('navigationMenu')

const props = defineProps<{
  class?: HTMLAttributes["class"]
  disabled?: boolean
  value?: string
}>()

const nav = inject(navigationMenuContextKey)
const triggerValue = computed(() => props.value ?? '')
const isOpen = computed(() => nav ? nav.activeValue.value === triggerValue.value : false)

function handleClick() {
  if (!nav) return
  // Toggle: close if already open, open otherwise
  nav.setValue(isOpen.value ? '' : triggerValue.value)
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :data-state="isOpen ? 'open' : 'closed'"
    :class="cn(navigationMenuTriggerVariants(), props.class)"
    :aria-expanded="isOpen"
    @click="handleClick"
  >
    <slot />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="relative top-[1px]"
      :class="navigationMenuTriggerIconVariants()"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  </button>
</template>
