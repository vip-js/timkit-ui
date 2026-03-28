<script setup lang="ts">
import { computed, mergeProps, useAttrs } from 'vue'
import type { AssertNoExtraKeys, DateFieldVueProps } from '@timui/core'
import { cn, dateFieldInputVariants } from '@timui/core'
import { useDateRangePickerContext } from '../date-range-picker/use-date-range-picker-context'
import { useDateFieldContext } from '../datefield/use-date-field-context'

defineOptions({
  inheritAttrs: false,
})

type DateInputProps = DateFieldVueProps & { class?: string }
type _DateInputPropsGuard = AssertNoExtraKeys<
  DateInputProps,
  DateFieldVueProps & { class?: string }
>

const props = withDefaults(defineProps<DateInputProps>(), {
  unstyled: false,
  invalid: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}>()

const attrs = useAttrs()
const dateRangePicker = useDateRangePickerContext()
const dateFieldContext = useDateFieldContext()

const resolvedType = computed(() => props.type ?? dateFieldContext?.inputType ?? 'date')
const resolvedStep = computed(() => {
  const stepFromAttrs = attrs.step as number | string | undefined
  if (stepFromAttrs !== undefined) return stepFromAttrs
  if (dateFieldContext?.granularity === 'second') return 1
  if (dateFieldContext?.granularity === 'minute') return 60
  return undefined
})

const slotIndex = computed(() => {
  const slot = attrs['data-slot']
  if (slot === 'end') return 1
  return 0
})

const rangeInputProps = computed(() =>
  dateRangePicker?.value?.getInputProps?.({ index: slotIndex.value }) ?? {}
)

const mergedRangeProps = computed(() =>
  mergeProps(attrs, rangeInputProps.value, {
    class: cn(
      !props.unstyled && dateFieldInputVariants(),
      (rangeInputProps.value as { class?: string }).class,
      props.class,
      attrs.class as string
    ),
    'aria-invalid': props.invalid || undefined,
  })
)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}
</script>

<template>
  <input
    v-if="!dateRangePicker"
    v-bind="attrs"
    :type="resolvedType"
    :step="resolvedStep"
    :value="props.modelValue"
    :class="cn(!props.unstyled && dateFieldInputVariants(), props.class, attrs.class as string)"
    :aria-invalid="props.invalid || undefined"
    @input="onInput"
  />
  <input v-else v-bind="mergedRangeProps" />
</template>
