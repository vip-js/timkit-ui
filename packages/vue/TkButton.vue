<script setup lang="ts">
import { computed } from "vue"
import "@timui/core/button.css"

type Variant = "primary" | "secondary" | "ghost" | "destructive"
type Size = "sm" | "md" | "lg"

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  }
)

const emit = defineEmits<{
  (e: "press", event: MouseEvent): void
}>()

const classes = computed(() => [
  "tk-button",
  props.variant,
  `size-${props.size}`,
  {
    "is-disabled": props.disabled,
    "is-loading": props.loading,
  },
])

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit("press", event)
}
</script>

<template>
  <button
    type="button"
    :class="classes"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <slot name="icon-left" />
    <span class="tk-button__label">
      <slot>
        {{ props.label }}
      </slot>
    </span>
    <slot name="icon-right" />
    <span v-if="props.loading" class="tk-button__spinner" aria-hidden="true" />
  </button>
</template>
