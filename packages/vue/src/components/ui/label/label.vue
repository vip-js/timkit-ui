<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Label, type LabelProps } from 'radix-vue'
import { cn, labelVariants } from '@timui/core'

const props = defineProps<
  LabelProps & {
    class?: HTMLAttributes['class']
    htmlFor?: string
  }
>()

const delegatedProps = computed(() => {
  const { class: _, htmlFor, ...delegated } = props
  if (htmlFor !== undefined) {
    return {
      ...delegated,
      for: htmlFor,
    }
  }
  return delegated
})
</script>

<template>
    <Label
      v-bind="delegatedProps"
      :class="
        cn(
        labelVariants(),
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
