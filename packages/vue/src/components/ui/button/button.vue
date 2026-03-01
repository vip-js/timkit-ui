<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { AssertNoExtraKeys, ButtonProps as CoreButtonProps } from '@timui/core'
import { type PrimitiveProps, Primitive } from '../../primitive'
import { cn, buttonVariants } from '@timui/core'

type ButtonProps = CoreButtonProps &
  /* @vue-ignore */ PrimitiveProps & {
    class?: HTMLAttributes['class']
  }
type _ButtonPropsGuard = AssertNoExtraKeys<
  ButtonProps,
  CoreButtonProps & PrimitiveProps & { class?: HTMLAttributes['class'] }
>

interface Props extends ButtonProps {}

const emit = defineEmits<{
  (e: 'press', event: MouseEvent): void
}>()

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const calculatedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)

const handlePress = (event: MouseEvent) => {
  emit('press', event)
}
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="calculatedClass"
    @click="handlePress"
  >
    <slot />
  </Primitive>
</template>
