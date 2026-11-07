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

const focusField = (event: MouseEvent) => {
  if (event.defaultPrevented || !props.htmlFor) return
  const field = document.getElementById(props.htmlFor)
  if (field instanceof HTMLElement && document.activeElement !== field) field.focus()
}
</script>

<template>
    <Label
      data-slot="label"
      v-bind="delegatedProps"
      @click="focusField"
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
