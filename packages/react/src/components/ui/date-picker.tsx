'use client'

import * as React from 'react'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import {
  cn,
  datePickerConnect,
  datePickerContentVariants,
  datePickerMachine,
  datePickerRootVariants,
  datePickerTriggerButtonVariants,
  datePickerTriggerIconVariants,
  datePickerTriggerLabelEmptyVariants,
  datePickerTriggerLabelVariants,
  datePickerTriggerVariants,
} from '@timui/core'
import type { Placement } from '@zag-js/popper'
import { normalizeProps, Portal, useMachine } from '@zag-js/react'

import { Button } from './button'
import { Calendar } from './calendar'
import type { CalendarProps, CalendarRangeValue, CalendarSelectedValue } from './calendar'

type DatePickerMode = 'single' | 'range'

type DatePickerValue = Date | CalendarRangeValue | undefined

interface DatePickerProps {
  id?: string
  mode?: DatePickerMode
  value?: DatePickerValue
  defaultValue?: DatePickerValue
  onValueChange?: (value: DatePickerValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  locale?: string
  placeholder?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>
}

const toPickerDate = (input: Date) =>
  new CalendarDate(input.getFullYear(), input.getMonth() + 1, input.getDate())

const toDateValueArray = (value: DatePickerValue, mode: DatePickerMode) => {
  if (!value) return undefined
  if (value instanceof Date) return [toPickerDate(value)]

  if (mode === 'range') {
    if (!value.from) return undefined
    const parsed: DateValue[] = []
    parsed.push(toPickerDate(value.from))
    if (value.to) parsed.push(toPickerDate(value.to))
    return parsed.length > 0 ? parsed : undefined
  }

  const fallback = value.from ?? value.to
  return fallback ? [toPickerDate(fallback)] : undefined
}

const toModelValue = (values: DateValue[], mode: DatePickerMode, timeZone: string): DatePickerValue => {
  if (mode === 'range') {
    const from = values[0]?.toDate(timeZone)
    const to = values[1]?.toDate(timeZone)
    return from || to ? { from, to } : undefined
  }

  return values[0]?.toDate(timeZone)
}

const toCalendarSelected = (values: Date[], mode: DatePickerMode): CalendarSelectedValue => {
  if (mode === 'range') {
    return {
      from: values[0],
      to: values[1],
    }
  }

  return values[0]
}

function DatePicker({
  id,
  mode = 'single',
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  required,
  name,
  locale,
  placeholder = 'Date',
  className,
  triggerClassName,
  contentClassName,
  calendarProps,
}: DatePickerProps) {
  const generatedId = React.useId()
  const datePickerId = id ?? generatedId
  const timeZone = getLocalTimeZone()
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    [locale]
  )

  const controlledValue = React.useMemo(
    () => (value !== undefined ? toDateValueArray(value, mode) : undefined),
    [mode, value]
  )

  const defaultMachineValue = React.useMemo(
    () => (value === undefined ? toDateValueArray(defaultValue, mode) : undefined),
    [defaultValue, mode, value]
  )

  const service = useMachine(datePickerMachine, {
    id: datePickerId,
    selectionMode: mode,
    numOfMonths: calendarProps?.numberOfMonths ?? 1,
    outsideDaySelectable: true,
    timeZone,
    value: controlledValue,
    defaultValue: defaultMachineValue,
    open,
    defaultOpen,
    disabled,
    required,
    name,
    locale,
    onOpenChange(details) {
      onOpenChange?.(details.open)
    },
    onValueChange(details) {
      onValueChange?.(toModelValue(details.value, mode, timeZone))
    },
    positioning: {
      placement: 'bottom-start' as Placement,
      gutter: 6,
    },
  })

  const api = React.useMemo(() => datePickerConnect(service, normalizeProps), [service])

  const calendarSelected = React.useMemo(
    () => toCalendarSelected(api.valueAsDate ?? [], mode),
    [api.valueAsDate, mode]
  )

  const label = React.useMemo(() => {
    const formatSingle = (date: Date) => formatter.format(date)
    const formatRange = (rangeValue: CalendarRangeValue) => {
      if (rangeValue.from && rangeValue.to) {
        return `${formatSingle(rangeValue.from)} - ${formatSingle(rangeValue.to)}`
      }
      if (rangeValue.from) {
        return formatSingle(rangeValue.from)
      }
      return ''
    }

    if (mode === 'range') {
      return calendarSelected && typeof calendarSelected === 'object' && 'from' in calendarSelected
        ? formatRange(calendarSelected as CalendarRangeValue)
        : ''
    }

    return calendarSelected instanceof Date ? formatSingle(calendarSelected) : ''
  }, [calendarSelected, formatter, mode])

  const handleCalendarSelect = React.useCallback(
    (next: CalendarSelectedValue) => {
      const values = toDateValueArray(next as DatePickerValue, mode)
      api.setValue(values ?? [])

      if (
        !values ||
        (mode === 'single' && values.length >= 1) ||
        (mode === 'range' && values.length >= 2)
      ) {
        api.setOpen(false)
      }
    },
    [api, mode]
  )

  const rootProps = api.getRootProps() as React.HTMLAttributes<HTMLDivElement>
  const triggerProps = api.getTriggerProps() as React.ButtonHTMLAttributes<HTMLButtonElement>
  const { className: triggerPropsClassName, ...restTriggerProps } = triggerProps

  const positionerProps = api.getPositionerProps() as React.HTMLAttributes<HTMLDivElement> & {
    style?: React.CSSProperties
  }
  const { style: positionerStyle, ...restPositionerProps } = positionerProps

  const contentProps = api.getContentProps() as React.HTMLAttributes<HTMLDivElement>
  const { className: contentPropsClassName, ...restContentProps } = contentProps

  return (
    <div
      {...rootProps}
      data-slot="date-picker"
      className={cn(datePickerRootVariants(), rootProps.className, className)}
    >
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(
          datePickerTriggerVariants(),
          datePickerTriggerButtonVariants(),
          triggerClassName,
          triggerPropsClassName
        )}
      >
        <button {...restTriggerProps}>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={datePickerTriggerIconVariants()}
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <path d="M3 10h18" />
          </svg>
          <span
            className={cn(
              datePickerTriggerLabelVariants(),
              !label && datePickerTriggerLabelEmptyVariants()
            )}
          >
            {label || placeholder}
          </span>
        </button>
      </Button>

      {api.open ? (
        <Portal>
          <div
            {...restPositionerProps}
            style={{
              ...positionerStyle,
              zIndex: 50,
            }}
          >
            <div
              {...restContentProps}
              data-slot="date-picker-content"
              className={cn(datePickerContentVariants(), contentPropsClassName, contentClassName)}
            >
              <Calendar
                {...calendarProps}
                mode={mode}
                selected={calendarSelected}
                onSelect={handleCalendarSelect}
              />
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  )
}

export { DatePicker }
export type { DatePickerProps, DatePickerMode, DatePickerValue }
