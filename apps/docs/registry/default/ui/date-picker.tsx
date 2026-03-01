'use client'

import * as React from 'react'
import { cn } from '@timui/core'
import { format } from 'date-fns'
import type { DateRange, OnSelectHandler } from 'react-day-picker'

import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DatePickerMode = 'single' | 'range'

type DatePickerValue = Date | DateRange | undefined

interface DatePickerProps {
  mode?: DatePickerMode
  value?: DatePickerValue
  defaultValue?: DatePickerValue
  onValueChange?: (value: DatePickerValue) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>
}

type CalendarProps = React.ComponentProps<typeof Calendar>

const formatSingle = (value: Date) => format(value, 'LLL dd, y')
const formatRange = (value: DateRange) => {
  if (value.from && value.to) {
    return `${format(value.from, 'LLL dd, y')} - ${format(value.to, 'LLL dd, y')}`
  }
  if (value.from) {
    return format(value.from, 'LLL dd, y')
  }
  return ''
}

function DatePicker({
  mode = 'single',
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Date',
  className,
  triggerClassName,
  contentClassName,
  calendarProps,
}: DatePickerProps) {
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<DatePickerValue>(defaultValue)
  const selected = isControlled ? value : uncontrolled

  const handleChange = React.useCallback(
    (next: DatePickerValue) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const handleSelect = React.useCallback<OnSelectHandler<DatePickerValue>>(
    (next) => handleChange(next),
    [handleChange]
  )

  const label = React.useMemo(() => {
    if (mode === 'range') {
      return selected && typeof selected === 'object' && 'from' in selected
        ? formatRange(selected as DateRange)
        : ''
    }
    return selected instanceof Date ? formatSingle(selected) : ''
  }, [mode, selected])

  return (
    <div data-slot="date-picker" className={cn('w-full', className)}>
      <Popover>
        <PopoverTrigger asChild data-slot="date-picker-trigger" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
              triggerClassName
            )}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/80 -ms-1 shrink-0"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
            </svg>
            <span className={cn('truncate', !label && 'font-medium')}>{label || placeholder}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          data-slot="date-picker-content"
          className={cn('w-auto p-2', contentClassName)}
          align="start"
        >
          <Calendar
            mode={mode}
            selected={selected as never}
            onSelect={handleSelect}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { DatePicker }
export type { DatePickerProps, DatePickerMode, DatePickerValue }
