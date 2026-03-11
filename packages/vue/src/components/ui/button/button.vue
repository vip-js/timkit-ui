<script setup lang="ts">
import { type HTMLAttributes, computed, useId } from 'vue'
import type { AssertNoExtraKeys, ButtonProps as CoreButtonProps, ButtonPressEvent } from '@timui/core'
import { type PrimitiveProps, Primitive } from '../../primitive'
import { cn, buttonVariants, createTimEvent } from '@timui/core'

type ButtonProps = CoreButtonProps &
  /* @vue-ignore */ PrimitiveProps & {
    class?: HTMLAttributes['class']
    id?: string
  }
type _ButtonPropsGuard = AssertNoExtraKeys<
  ButtonProps,
  CoreButtonProps & PrimitiveProps & { class?: HTMLAttributes['class'], id?: string }
>

interface Props extends ButtonProps {}

const emit = defineEmits<{
  (e: 'press', event: ButtonPressEvent): void
}>()

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const calculatedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)

const generatedId = useId()
const buttonId = computed(() => props.id ?? generatedId)

const handlePress = (event: MouseEvent) => {
  // Emit the custom TimEvent (cross-platform press protocol)
  emit('press', createTimEvent('press', buttonId.value, {}))
  // Also call onPress prop directly if provided (matches React's onPress prop pattern)
  props.onPress?.(createTimEvent('press', buttonId.value, {}))
}
</script>

<template>
  <Primitive
    data-slot="button"
    :id="buttonId"
    :as="as"
    :as-child="asChild"
    :class="calculatedClass"
    @click="handlePress"
  >
    <slot />
  </Primitive>
</template>
