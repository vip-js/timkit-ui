<script setup lang="ts">
import { ref, provide, type HTMLAttributes, type InjectionKey } from "vue";
import { cva } from "../../lib/cva";
import { cn } from "../../lib/utils";
import NavigationMenuViewport from "./navigation-menu-viewport.vue";

const navigationMenuRootVariants = cva('relative z-10 flex max-w-max flex-1 items-center justify-center')

export interface NavigationMenuContext {
  activeValue: ReturnType<typeof ref<string>>
  setValue: (val: string) => void
}

export const navigationMenuContextKey: InjectionKey<NavigationMenuContext> = Symbol('navigationMenu')

const props = defineProps<{
  class?: HTMLAttributes["class"]
  modelValue?: string
  defaultValue?: string
  dir?: 'ltr' | 'rtl'
  delayDuration?: number
  skipDelayDuration?: number
  orientation?: 'horizontal' | 'vertical'
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Controlled or uncontrolled activeValue
const internalValue = ref(props.defaultValue ?? '')
const activeValue = props.modelValue !== undefined
  ? ref(props.modelValue)
  : internalValue

provide(navigationMenuContextKey, {
  activeValue,
  setValue: (val: string) => {
    internalValue.value = val
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <nav
    aria-label="Main navigation"
    :data-orientation="orientation ?? 'horizontal'"
    :class="cn(navigationMenuRootVariants(), props.class)"
  >
    <slot />
    <NavigationMenuViewport />
  </nav>
</template>
