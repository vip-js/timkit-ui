<script setup lang="ts">
import { cn } from '@timui/core'
import { inject, computed, type HTMLAttributes } from 'vue'
import { toggleVariants } from './toggle.vue'
import { ToggleGroupContextKey, type ToggleGroupContextValue } from './toggle-group.vue'

const context = inject<ToggleGroupContextValue>(ToggleGroupContextKey)

const props = withDefaults(
  defineProps<{
    value: string
    class?: HTMLAttributes['class']
    variant?: ToggleGroupContextValue['variant']
    size?: ToggleGroupContextValue['size']
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
  },
)

const itemState = computed(() =>
  context?.api.value.getItemState?.({ value: props.value, disabled: props.disabled }) ?? {
    pressed: false,
    disabled: false,
  },
)
const itemProps = computed(() =>
  context?.api.value.getItemProps?.({ value: props.value, disabled: props.disabled }) ?? {},
)
const resolvedVariant = computed(() => context?.variant || props.variant)
const resolvedSize = computed(() => context?.size || props.size)
</script>

<template>
  <button
    v-bind="itemProps"
    data-slot="toggle-group-item"
    type="button"
    :data-state="itemState.pressed ? 'on' : 'off'"
    :class="cn(toggleVariants({ variant: resolvedVariant, size: resolvedSize }), props.class)"
  >
    <slot />
  </button>
</template>
