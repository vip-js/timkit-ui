<script setup lang="ts">
import { cn } from '@timui/core'
import { inject, computed, onBeforeUnmount, onMounted, type HTMLAttributes } from 'vue'
import { toggleVariants } from '@timui/core'
import { ToggleGroupContextKey, type ToggleGroupContextValue } from './use-toggle-group-context'

const context = inject<ToggleGroupContextValue>(ToggleGroupContextKey)
let unregister: (() => void) | undefined

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

const itemDisabled = computed(() => Boolean(props.disabled || context?.disabled))
const itemState = computed(() =>
  context?.api.value.getItemState?.({ value: props.value, disabled: itemDisabled.value }) ?? {
    pressed: false,
    disabled: itemDisabled.value,
  },
)
const itemProps = computed(() => {
  const machineProps =
    context?.api.value.getItemProps?.({ value: props.value, disabled: itemDisabled.value }) ?? {}
  const { onClick: _onClick, ...rest } = machineProps
  return rest
})
const onPress = (event: MouseEvent) => {
  if (itemDisabled.value) return
  const click = context?.api.value.getItemProps?.({
    value: props.value,
    disabled: itemDisabled.value,
  }).onClick as ((event: MouseEvent) => void) | undefined
  click?.(event)
}
onMounted(() => {
  unregister = context?.register(props.value)
})
onBeforeUnmount(() => unregister?.())
const resolvedVariant = computed(() => context?.variant || props.variant)
const resolvedSize = computed(() => context?.size || props.size)
</script>

<template>
  <button
    v-bind="itemProps"
    data-slot="toggle-group-item"
    type="button"
    :data-state="itemState.pressed ? 'on' : 'off'"
    :disabled="itemDisabled || undefined"
    :class="cn(toggleVariants({ variant: resolvedVariant, size: resolvedSize }), props.class)"
    @click="onPress"
  >
    <slot />
  </button>
</template>
