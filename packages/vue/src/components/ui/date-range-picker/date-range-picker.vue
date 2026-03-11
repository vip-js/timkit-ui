<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { AssertNoExtraKeys, DatePickerVueProps } from '@timui/core'
import { cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'
import { useDatePicker } from '../date-picker/use-date-picker'
import { DateRangePickerProvider } from './use-date-range-picker-context'

defineOptions({
  inheritAttrs: false,
})

type DateRangePickerProps = DatePickerVueProps & { class?: HTMLAttributes['class'] }
type _DateRangePickerPropsGuard = AssertNoExtraKeys<
  DateRangePickerProps,
  DatePickerVueProps & { class?: HTMLAttributes['class'] }
>

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  mode: 'range',
  numberOfMonths: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value?: Date | { from?: Date; to?: Date }): void
  (e: 'change', value?: Date | { from?: Date; to?: Date }): void
}>()

const attrs = useAttrs()
const { api } = useDatePicker(props, emit)

DateRangePickerProvider(api)

const rootProps = computed(() => ({
  ...(api.value?.getRootProps?.() ?? {}),
  ...attrs,
  class: cn(props.class, (attrs.class as string) || ''),
  'data-slot': 'date-range-picker',
}))
</script>

<template>
  <div v-bind="rootProps">
    <slot />
  </div>
</template>
