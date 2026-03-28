<script setup lang="ts">
import { computed } from 'vue'
import type { AssertNoExtraKeys, DatePickerVueProps } from '@timui/core'
import {
  cn,
  datePickerContentVariants,
  datePickerRootVariants,
  datePickerTriggerButtonVariants,
  datePickerTriggerIconVariants,
  datePickerTriggerLabelEmptyVariants,
  datePickerTriggerLabelVariants,
  datePickerTriggerVariants,
} from '@timui/core'
import Button from '../button/button.vue'
import Calendar from '../calendar/calendar.vue'
import { useDatePicker } from './use-date-picker'

type DatePickerProps = DatePickerVueProps & {
  class?: string
  triggerClass?: string
  contentClass?: string
  calendarProps?: Record<string, unknown>
}

type _DatePickerPropsGuard = AssertNoExtraKeys<
  DatePickerProps,
  DatePickerVueProps & {
    class?: string
    triggerClass?: string
    contentClass?: string
    calendarProps?: Record<string, unknown>
  }
>

const props = withDefaults(defineProps<DatePickerProps>(), {
  mode: 'single',
  placeholder: 'Date',
  numberOfMonths: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value?: Date | { from?: Date; to?: Date }): void
  (e: 'change', value?: Date | { from?: Date; to?: Date }): void
}>()

const { api } = useDatePicker(props, emit)

const rootProps = computed(() => api.value?.getRootProps?.() ?? {})
const triggerProps = computed(() => api.value?.getTriggerProps?.() ?? {})
const positionerProps = computed(() => api.value?.getPositionerProps?.() ?? {})
const contentProps = computed(() => api.value?.getContentProps?.() ?? {})

const formatter = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
)

const formatDate = (date: Date) => formatter.value.format(date)

const label = computed(() => {
  const values = api.value?.valueAsDate ?? []
  if (props.mode === 'range') {
    if (!values.length) return ''
    const from = values[0]
    const to = values[1]
    if (from && to) return `${formatDate(from)} - ${formatDate(to)}`
    if (from) return formatDate(from)
    return ''
  }
  return values[0] ? formatDate(values[0]) : ''
})

const triggerClassName = computed(() =>
  cn(
    datePickerTriggerVariants(),
    datePickerTriggerButtonVariants(),
    (triggerProps.value as { class?: string }).class,
    props.triggerClass
  )
)

const contentClassName = computed(() =>
  cn(
    datePickerContentVariants(),
    (contentProps.value as { class?: string }).class,
    props.contentClass
  )
)
</script>

<template>
  <div
    v-bind="rootProps"
    data-slot="date-picker"
    :class="cn(datePickerRootVariants(), rootProps.class, props.class)"
  >
    <Button as-child variant="outline" size="sm" :class="triggerClassName">
      <button v-bind="triggerProps">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="datePickerTriggerIconVariants()"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 10h18" />
        </svg>
        <span
          :class="
            cn(datePickerTriggerLabelVariants(), !label && datePickerTriggerLabelEmptyVariants())
          "
        >
          {{ label || props.placeholder }}
        </span>
      </button>
    </Button>

    <Teleport to="body">
      <div v-if="api?.open" v-bind="positionerProps" style="z-index: 50">
        <div v-bind="contentProps" data-slot="date-picker-content" :class="contentClassName">
          <Calendar v-bind="props.calendarProps" :mode="props.mode" :external-api="api" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
