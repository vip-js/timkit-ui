<script setup lang="ts">
import { type HTMLAttributes, computed, useAttrs, useId } from 'vue'
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

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
const attrs = useAttrs()
const accessibleName = computed(() => {
  const fromAttrs = attrs['aria-label']
  if (typeof fromAttrs === 'string' && fromAttrs.length > 0) return fromAttrs
  if (props.size === 'icon' && props.label) return props.label
  return undefined
})

const calculatedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)

const buttonType = computed(() => {
  if ((props.as || 'button') !== 'button' || props.asChild) return undefined
  const passed = attrs.type
  if (typeof passed === 'string' && passed.length > 0) return passed
  return 'button'
})

const generatedId = useId()
const buttonId = computed(() => props.id ?? generatedId)

const handlePress = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('press', createTimEvent('press', buttonId.value, {}))
}
</script>

<template>
  <p v-if="props.loading" role="status">Loading</p>
  <Primitive
    v-bind="attrs"
    data-slot="button"
    :id="buttonId"
    :as="props.as || 'button'"
    :type="buttonType"
    :as-child="props.asChild || false"
    :disabled="props.disabled || props.loading || undefined"
    :aria-busy="props.loading || undefined"
    :data-loading="props.loading ? '' : undefined"
    :aria-label="accessibleName"
    :class="calculatedClass"
    @click="handlePress"
  >
    <slot />
  </Primitive>
</template>
