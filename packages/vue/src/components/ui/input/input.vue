<script setup lang="ts">
import { type HTMLAttributes, computed, useAttrs, useId } from 'vue'
import type { AssertNoExtraKeys, InputVueProps, TextInputValueChangeEvent } from '@timui/core'
import { cn, inputVariants, createTimEvent } from '@timui/core'

defineOptions({
  inheritAttrs: false,
})

type InputProps = InputVueProps & { class?: HTMLAttributes['class'] }
type _InputPropsGuard = AssertNoExtraKeys<
  InputProps,
  InputVueProps & { class?: HTMLAttributes['class'] }
>

const props = defineProps<InputProps>()
const attrs = useAttrs()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'valueChange', event: TextInputValueChangeEvent): void
}>()

const modelValue = defineModel<string | number>({ required: false })
const inputType = computed(() => {
  const type = attrs.type
  if (type === 'search') return 'search'
  if (type === 'file') return 'file'
  return 'default'
})

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  // React fires onValueChange on every stroke to match its behavior, which maps to Vue's @input
  if (props.onValueChange) {
    props.onValueChange(createTimEvent('change', inputId.value, { value: target.value }))
  }
  emit('valueChange', createTimEvent('change', inputId.value, { value: target.value }))
}
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :id="inputId"
    :class="
      cn(
        inputVariants({ type: inputType }),
        props.class,
      )
    "
    v-bind="$attrs"
    @input="handleChange"
  />
</template>
