<script setup lang="ts">
import { cn, toggleVariants, type ToggleVariants } from '@timui/core'
import { computed, type HTMLAttributes } from 'vue'
import { useToggle } from './use-toggle'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: ToggleVariants['variant']
    size?: ToggleVariants['size']
    pressed?: boolean | null
    modelValue?: boolean | null
    defaultPressed?: boolean
    disabled?: boolean
    onPressedChange?: (pressed: boolean) => void
  }>(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
)

const emit = defineEmits(['update:pressed', 'update:modelValue', 'pressedChange', 'change'])

const api = useToggle(props, emit)

const computedClass = computed(() =>
  cn(toggleVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <p v-if="api.pressed" role="status">Pressed</p>
  <button
    v-bind="api.getRootProps()"
    type="button"
    data-slot="toggle"
    :data-state="api.pressed ? 'on' : 'off'"
    :aria-pressed="api.pressed"
    :class="computedClass"
  >
    <slot />
  </button>
</template>
