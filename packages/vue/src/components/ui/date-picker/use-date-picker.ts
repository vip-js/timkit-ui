import { getLocalTimeZone } from '@internationalized/date'
import { datePickerConnect, datePickerMachine } from '@timui/core'
import type {
  DatePickerMode,
  DatePickerRangeValue,
  DatePickerVueProps,
  DatePickerVueValue,
} from '@timui/core'
import { parse as parseDateValue } from '@zag-js/date-picker'
import type { DateValue } from '@zag-js/date-picker'
import type { Placement } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export type UseDatePickerProps = DatePickerVueProps & {
  numberOfMonths?: number
}

type DatePickerModelValue =
  | Date
  | {
      from?: Date
      to?: Date
    }
  | undefined

export type UseDatePickerEmits = {
  (e: 'update:modelValue', value: DatePickerModelValue): void
  (e: 'change', value: DatePickerModelValue): void
}

export function useDatePicker(props: UseDatePickerProps, emit: UseDatePickerEmits) {
  const localTimeZone = getLocalTimeZone()
  const generatedId = useId()
  const toPickerDate = (input: string | Date) =>
    parseDateValue(
      input instanceof Date
        ? `${input.getFullYear()}-${String(input.getMonth() + 1).padStart(2, '0')}-${String(
            input.getDate()
          ).padStart(2, '0')}`
        : input
    )

  const toDateValueArray = (value: DatePickerVueValue | undefined, mode: DatePickerMode) => {
    if (!value) return undefined
    if (value instanceof Date) return [toPickerDate(value)]

    const range = value as DatePickerRangeValue
    if (mode === 'range') {
      if (!range?.from) return undefined
      const parsed: DateValue[] = []
      parsed.push(toPickerDate(range.from))
      if (range?.to) parsed.push(toPickerDate(range.to))
      return parsed.length ? parsed : undefined
    }

    const fallback = range?.from ?? range?.to
    return fallback ? [toPickerDate(fallback)] : undefined
  }

  const toModelValue = (values: DateValue[], mode: DatePickerMode) => {
    if (mode === 'range') {
      const from = values[0]?.toDate(localTimeZone)
      const to = values[1]?.toDate(localTimeZone)
      return from || to ? { from, to } : undefined
    }
    return values[0]?.toDate(localTimeZone)
  }

  const machineProps = computed(() => {
    const mode = props.mode || 'single'
    const currentValue = props.modelValue ?? props.value
    const controlledValue =
      currentValue !== undefined ? toDateValueArray(currentValue, mode) : undefined

    const defaultValue =
      currentValue === undefined ? toDateValueArray(props.defaultValue, mode) : undefined
    const min = props.minDate ? toPickerDate(props.minDate) : undefined
    const max = props.maxDate ? toPickerDate(props.maxDate) : undefined

    return {
      id: props.id ?? generatedId,
      selectionMode: mode,
      numOfMonths: props.numberOfMonths || 1,
      outsideDaySelectable: true,
      timeZone: localTimeZone,
      min,
      max,
      value: controlledValue,
      defaultValue,
      open: props.open,
      defaultOpen: props.defaultOpen,
      disabled: props.disabled,
      required: props.required,
      name: props.name,
      locale: props.locale,
      isDateUnavailable: props.isDateUnavailable
        ? (date: DateValue) => props.isDateUnavailable?.(date.toDate(localTimeZone)) ?? false
        : undefined,
      onValueChange(details: { value: DateValue[] }) {
        const next = toModelValue(details.value, mode)
        props.onValueChange?.(next)
        emit('update:modelValue', next)
        emit('change', next)
      },
      onOpenChange(details: { open: boolean }) {
        props.onOpenChange?.(details.open)
      },
      positioning: {
        placement: 'bottom-start' as Placement,
        gutter: 6,
      },
    }
  })

  const service = useMachine(datePickerMachine, machineProps)
  const api = computed(() => datePickerConnect(service, normalizeProps))

  return {
    api,
    localTimeZone,
  }
}
