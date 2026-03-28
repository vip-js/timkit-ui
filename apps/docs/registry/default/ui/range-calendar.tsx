'use client'

import * as React from 'react'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import { Calendar } from './calendar'
import type { CalendarRangeValue, CalendarSelectedValue } from './calendar'
import { DateRangePickerContext } from './date-range-picker/use-date-range-picker-context'

const toDateValue = (date: Date) =>
  new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

const toDateValueArray = (value: CalendarSelectedValue): DateValue[] => {
  if (!value) return []
  if (value instanceof Date) return [toDateValue(value)]
  if (Array.isArray(value)) return value.slice(0, 2).map((date) => toDateValue(date))

  const parsed: DateValue[] = []
  if (value.from) parsed.push(toDateValue(value.from))
  if (value.to) parsed.push(toDateValue(value.to))
  return parsed
}

function RangeCalendar({ selected, onSelect, ...props }: React.ComponentProps<typeof Calendar>) {
  const context = React.useContext(DateRangePickerContext)

  const selectedFromContext = React.useMemo<CalendarRangeValue | undefined>(() => {
    const from = context?.valueAsDate?.[0]
    const to = context?.valueAsDate?.[1]
    return from || to ? { from, to } : undefined
  }, [context?.valueAsDate])

  const handleSelect = React.useCallback(
    (next: CalendarSelectedValue) => {
      onSelect?.(next)

      if (!context) return

      const nextValues = toDateValueArray(next)
      context.setValue(nextValues)

      if (nextValues.length !== 1) {
        context.setOpen(false)
      }
    },
    [context, onSelect]
  )

  return (
    <Calendar
      mode="range"
      selected={selected ?? selectedFromContext}
      onSelect={context ? handleSelect : onSelect}
      {...props}
    />
  )
}

export { RangeCalendar }
