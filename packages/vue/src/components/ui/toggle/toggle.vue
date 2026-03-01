<script setup lang="ts">
import { cn, toggleVariants, type ToggleVariants } from '@timui/core'
import { computed, type HTMLAttributes } from 'vue'
import { useToggle } from './use-toggle'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: ToggleVariants['variant']
    size?: ToggleVariants['size']
    pressed?: boolean
    modelValue?: boolean
    defaultPressed?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
)

const emit = defineEmits(['update:pressed', 'update:modelValue', 'pressedChange', 'change'])

const api = useToggle({
  pressed: props.pressed ?? props.modelValue,
  defaultPressed: (props.pressed ?? props.modelValue) === undefined ? props.defaultPressed : undefined,
  disabled: props.disabled,
  onPressedChange: (next: boolean) => {
    emit('update:pressed', next)
    emit('update:modelValue', next)
    emit('pressedChange', next)
    emit('change', next)
  },
})

const computedClass = computed(() =>
  cn(toggleVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
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
