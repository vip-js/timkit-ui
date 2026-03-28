import { getLocalTimeZone } from '@internationalized/date'
import { calendarConnect, calendarMachine } from '@timui/core'
import type {
  CalendarDisabledMatcher,
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
}

type CalendarModelValue =
  | Date
  | Date[]
  | {
      from?: Date
      to?: Date
    }
  | undefined

export type UseCalendarEmits = {
  (e: 'update:modelValue', value: CalendarModelValue): void
  (e: 'change', value: CalendarModelValue): void
}

const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const toMonthEnd = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const addMonths = (date: Date, count: number) => new Date(date.getFullYear(), date.getMonth() + count, 1)

const compareMonth = (a: Date, b: Date) => a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth()

const clampMonth = (date: Date, min?: Date, max?: Date) => {
  if (min && compareMonth(date, min) < 0) return min
  if (max && compareMonth(date, max) > 0) return max
  return date
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isMatchObject = (
  date: Date,
  matcher: {
    before?: Date
    after?: Date
    from?: Date
    to?: Date
    dayOfWeek?: number[]
  }
) => {
  const current = toDateOnly(date).getTime()
  const before = matcher.before ? toDateOnly(matcher.before).getTime() : undefined
  const after = matcher.after ? toDateOnly(matcher.after).getTime() : undefined
  const from = matcher.from ? toDateOnly(matcher.from).getTime() : undefined
  const to = matcher.to ? toDateOnly(matcher.to).getTime() : undefined
  const weekdayMatched = Array.isArray(matcher.dayOfWeek) && matcher.dayOfWeek.includes(date.getDay())

  if (from !== undefined || to !== undefined) {
    const min = from ?? Number.NEGATIVE_INFINITY
    const max = to ?? Number.POSITIVE_INFINITY
    if (current >= min && current <= max) return true
  }

  if (before !== undefined && current < before) return true
  if (after !== undefined && current > after) return true
  if (weekdayMatched) return true
  return false
}

const matchDisabled = (date: Date, matcher: CalendarDisabledMatcher) => {
  if (matcher instanceof Date) return isSameDay(date, matcher)
  if (typeof matcher === 'function') return matcher(date)
  return isMatchObject(date, matcher)
}

const isRangeValue = (value: CalendarModelValue): value is Exclude<CalendarRangeValue, undefined> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)

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

  const dateFromSelected = (value: CalendarVueValue | undefined, mode: CalendarMode) => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (Array.isArray(value) && mode === 'multiple') return value[0]
    const range = value as CalendarRangeValue
    return range?.from ?? range?.to
  }

  const toDateValueArray = (value: CalendarVueValue | undefined, mode: CalendarMode) => {
    if (!value) return undefined
    if (mode === 'range') {
      if (value instanceof Date) return [toCalendarDate(value)]
      if (Array.isArray(value)) {
        const values = value.slice(0, 2).map((item) => toCalendarDate(item))
        return values.length ? values : undefined
      }
      const range = value as CalendarRangeValue
      const parsed: DateValue[] = []
      if (range?.from) parsed.push(toCalendarDate(range.from))
      if (range?.to) parsed.push(toCalendarDate(range.to))
      return parsed.length ? parsed : undefined
    }

    if (mode === 'multiple') {
      if (Array.isArray(value)) {
        const values = value.map((item) => toCalendarDate(item))
        return values.length ? values : undefined
      }
      if (value instanceof Date) return [toCalendarDate(value)]
      const range = value as CalendarRangeValue
      const fallback = range?.from ?? range?.to
      return fallback ? [toCalendarDate(fallback)] : undefined
    }

    if (value instanceof Date) return [toCalendarDate(value)]
    if (Array.isArray(value)) return value[0] ? [toCalendarDate(value[0])] : undefined
    const range = value as CalendarRangeValue
    const fallback = range?.from ?? range?.to
    return fallback ? [toCalendarDate(fallback)] : undefined
  }

  const toModelValue = (values: DateValue[], mode: CalendarMode) => {
    if (mode === 'multiple') {
      const dates = values.map((value) => value.toDate(localTimeZone))
      return dates.length ? dates : undefined
    }
    if (mode === 'range') {
      const from = values[0]?.toDate(localTimeZone)
      const to = values[1]?.toDate(localTimeZone)
      return from || to ? { from, to } : undefined
    }
    return values[0]?.toDate(localTimeZone)
  }

  const disabledMatchers = computed(() => {
    const matcher = props.disabled
    if (matcher === undefined || typeof matcher === 'boolean') return []
    return Array.isArray(matcher) ? matcher : [matcher]
  })

  const matchesUnavailable = (date: Date) =>
    disabledMatchers.value.some((matcher) => matchDisabled(date, matcher)) ||
    !!props.isDateUnavailable?.(date)

  const hasUnavailableBetween = (from: Date, to: Date) => {
    const start = toDateOnly(from)
    const end = toDateOnly(to)
    const min = start.getTime() <= end.getTime() ? start : end
    const max = start.getTime() <= end.getTime() ? end : start
    for (let cursor = new Date(min); cursor.getTime() <= max.getTime(); cursor.setDate(cursor.getDate() + 1)) {
      if (matchesUnavailable(cursor)) return true
    }
    return false
  }

  const normalizeExcludedRange = (value: CalendarModelValue, mode: CalendarMode) => {
    if (!props.excludeDisabled || mode !== 'range' || !isRangeValue(value) || !value.from || !value.to) {
      return value
    }
    if (!hasUnavailableBetween(value.from, value.to)) return value
    return { from: value.to, to: undefined }
  }

  const machineProps = computed(() => {
    const mode = props.mode || 'single'
    const externalValue = props.modelValue !== undefined ? props.modelValue : props.selected
    const controlledValue =
      externalValue !== undefined ? toDateValueArray(externalValue, mode) : undefined

    const defaultValue =
      externalValue === undefined
        ? toDateValueArray(props.defaultValue, mode)
        : undefined

    const numOfMonths = props.numberOfMonths || 1
    const minMonth = props.startMonth
      ? toMonthStart(props.startMonth)
      : props.minDate
        ? toMonthStart(props.minDate)
        : undefined
    const maxMonthBase = props.endMonth
      ? toMonthStart(props.endMonth)
      : props.maxDate
        ? toMonthStart(props.maxDate)
        : undefined
    const maxMonth = maxMonthBase ? addMonths(maxMonthBase, -(numOfMonths - 1)) : undefined

    const focusedBase = props.month
      ? clampMonth(toMonthStart(props.month), minMonth, maxMonth)
      : undefined
    const defaultFocusedBase =
      props.month === undefined
        ? clampMonth(
            toMonthStart(
              props.defaultMonth ??
                dateFromSelected(externalValue, mode) ??
                new Date()
            ),
            minMonth,
            maxMonth
          )
        : undefined

    const minDate = props.minDate ?? (props.startMonth ? toMonthStart(props.startMonth) : undefined)
    const maxDate = props.maxDate ?? (props.endMonth ? toMonthEnd(props.endMonth) : undefined)

    return {
      id: props.id ?? generatedId,
      inline: true,
      selectionMode: mode,
      numOfMonths,
      outsideDaySelectable: props.showOutsideDays ?? true,
      fixedWeeks: props.fixedWeeks,
      min: minDate ? toCalendarDate(minDate) : undefined,
      max: maxDate ? toCalendarDate(maxDate) : undefined,
      focusedValue: focusedBase ? toCalendarDate(focusedBase) : undefined,
      defaultFocusedValue: defaultFocusedBase ? toCalendarDate(defaultFocusedBase) : undefined,
      disabled: typeof props.disabled === 'boolean' ? props.disabled : undefined,
      timeZone: localTimeZone,
      value: controlledValue,
      defaultValue,
      isDateUnavailable: (date: DateValue) => matchesUnavailable(date.toDate(localTimeZone)),
      onValueChange(details: { value: DateValue[] }) {
        const rawNext = toModelValue(details.value, mode)
        const next = normalizeExcludedRange(rawNext, mode)
        props.onSelect?.(next)
        emit('update:modelValue', next)
        emit('change', next)
      },
      onVisibleRangeChange(details: { visibleRange: { start: DateValue } }) {
        props.onMonthChange?.(toMonthStart(details.visibleRange.start.toDate(localTimeZone)))
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
