<script setup lang="ts">
import { type HTMLAttributes, computed, useAttrs } from 'vue'
import type { AssertNoExtraKeys, InputVueProps } from '@timui/core'
import { cn, inputVariants } from '@timui/core'

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

const modelValue = defineModel<string | number>({ required: false })
const inputType = computed(() => {
  const type = attrs.type
  if (type === 'search') return 'search'
  if (type === 'file') return 'file'
  return 'default'
})
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        inputVariants({ type: inputType }),
        props.class,
      )
    "
    v-bind="$attrs"
  />
</template>
