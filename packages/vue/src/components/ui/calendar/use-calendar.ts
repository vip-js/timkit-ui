import { getLocalTimeZone } from '@internationalized/date'
import { calendarConnect, calendarMachine } from '@timui/core'
import type {
  CalendarMode,
  CalendarRangeValue,
  CalendarVueProps,
  CalendarVueValue,
} from '@timui/core'
import { parse as parseDateValue } from '@zag-js/date-picker'
import type { DateValue } from '@zag-js/date-picker'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export type UseCalendarProps = CalendarVueProps & {
  id?: string
  selected?: CalendarVueValue
  onSelect?: (value: CalendarModelValue) => void
  showOutsideDays?: boolean
  numberOfMonths?: number
  minDate?: string | Date
  maxDate?: string | Date
  isDateUnavailable?: (date: Date) => boolean
}

type CalendarModelValue =
  | Date
  | {
      from?: Date
      to?: Date
    }
  | undefined

export type UseCalendarEmits = {
  (e: 'update:modelValue', value: CalendarModelValue): void
  (e: 'change', value: CalendarModelValue): void
}

export function useCalendar(props: UseCalendarProps, emit: UseCalendarEmits) {
  const localTimeZone = getLocalTimeZone()
  const generatedId = useId()
  const toCalendarDate = (input: string | Date) =>
    parseDateValue(
      input instanceof Date
        ? `${input.getFullYear()}-${String(input.getMonth() + 1).padStart(2, '0')}-${String(
            input.getDate()
          ).padStart(2, '0')}`
        : input
    )

  const toDateValueArray = (value: CalendarVueValue | undefined, mode: CalendarMode) => {
    if (!value) return undefined
    if (value instanceof Date) return [toCalendarDate(value)]

    const range = value as CalendarRangeValue
    if (mode === 'range') {
      const parsed: DateValue[] = []
      if (range?.from) parsed.push(toCalendarDate(range.from))
      if (range?.to) parsed.push(toCalendarDate(range.to))
      return parsed.length ? parsed : undefined
    }

    const fallback = range?.from ?? range?.to
    return fallback ? [toCalendarDate(fallback)] : undefined
  }

  const toModelValue = (values: DateValue[], mode: CalendarMode) => {
    if (mode === 'range') {
      const from = values[0]?.toDate(localTimeZone)
      const to = values[1]?.toDate(localTimeZone)
      return from || to ? { from, to } : undefined
    }
    return values[0]?.toDate(localTimeZone)
  }

  const machineProps = computed(() => {
    const externalValue = props.modelValue !== undefined ? props.modelValue : props.selected
    const controlledValue =
      externalValue !== undefined ? toDateValueArray(externalValue, props.mode || 'single') : undefined

    const defaultValue =
      externalValue === undefined
        ? toDateValueArray(props.defaultValue, props.mode || 'single')
        : undefined

    return {
      id: props.id ?? generatedId,
      inline: true,
      selectionMode: props.mode || 'single',
      numOfMonths: props.numberOfMonths || 1,
      outsideDaySelectable: props.showOutsideDays ?? true,
      min: props.minDate ? toCalendarDate(props.minDate) : undefined,
      max: props.maxDate ? toCalendarDate(props.maxDate) : undefined,
      disabled: props.disabled,
      timeZone: localTimeZone,
      value: controlledValue,
      defaultValue,
      isDateUnavailable: props.isDateUnavailable
        ? (date: DateValue) => !!props.isDateUnavailable?.(date.toDate(localTimeZone))
        : undefined,
      onValueChange(details: { value: DateValue[] }) {
        const next = toModelValue(details.value, props.mode || 'single')
        props.onSelect?.(next)
        emit('update:modelValue', next)
        emit('change', next)
      },
    }
  })

  const service = useMachine(calendarMachine, machineProps)
  const api = computed(() => calendarConnect(service, normalizeProps))

  return {
    api,
    localTimeZone,
  }
}
