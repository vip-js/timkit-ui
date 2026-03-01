<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Label, type LabelProps } from 'radix-vue'
import { cn, labelVariants } from '@timui/core'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
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
