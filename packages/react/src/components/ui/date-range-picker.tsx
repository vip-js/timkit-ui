'use client'

import * as React from 'react'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { cn, datePickerConnect, datePickerMachine } from '@timui/core'
import type { Placement } from '@zag-js/popper'
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'

import { Slot } from './slot'
import {
  DateRangePickerProvider,
  useDateRangePickerContext,
} from './date-range-picker/use-date-range-picker-context'

type DateRangePickerValue =
  | {
      from?: Date
      to?: Date
    }
  | undefined

type DateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string
  value?: DateRangePickerValue
  defaultValue?: DateRangePickerValue
  onValueChange?: (value: DateRangePickerValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  numberOfMonths?: number
}

const toPickerDate = (input: Date) =>
  new CalendarDate(input.getFullYear(), input.getMonth() + 1, input.getDate())

const toDateValueArray = (value?: DateRangePickerValue) => {
  if (!value) return undefined
  const parsed: DateValue[] = []
  if (value.from) parsed.push(toPickerDate(value.from))
  if (value.to) parsed.push(toPickerDate(value.to))
  return parsed.length > 0 ? parsed : undefined
}

const toRangeValue = (values: DateValue[], timeZone: string): DateRangePickerValue => {
  const from = values[0]?.toDate(timeZone)
  const to = values[1]?.toDate(timeZone)
  return from || to ? { from, to } : undefined
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      children,
      id,
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      required,
      name,
      numberOfMonths = 1,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const pickerId = id ?? generatedId
    const timeZone = getLocalTimeZone()

    const controlledValue = React.useMemo(
      () => (value !== undefined ? toDateValueArray(value) : undefined),
      [value]
    )

    const defaultMachineValue = React.useMemo(
      () => (value === undefined ? toDateValueArray(defaultValue) : undefined),
      [defaultValue, value]
    )

    const service = useMachine(datePickerMachine, {
      id: pickerId,
      selectionMode: 'range',
      numOfMonths: numberOfMonths,
      outsideDaySelectable: true,
      timeZone,
      value: controlledValue,
      defaultValue: defaultMachineValue,
      open,
      defaultOpen,
      disabled,
      required,
      name,
      onOpenChange(details) {
        onOpenChange?.(details.open)
      },
      onValueChange(details) {
        onValueChange?.(toRangeValue(details.value, timeZone))
      },
      positioning: {
        placement: 'bottom-start' as Placement,
        gutter: 6,
      },
    })

    const api = React.useMemo(() => datePickerConnect(service, normalizeProps), [service])
    const mergedProps = mergeProps(api.getRootProps(), props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <DateRangePickerProvider value={api}>
        <div
          ref={ref}
          data-slot="date-range-picker"
          className={cn(className, mergedClassName)}
          {...restProps}
        >
          {children}
        </div>
      </DateRangePickerProvider>
    )
  }
)
DateRangePicker.displayName = 'DateRangePicker'

type DateRangePickerTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const DateRangePickerTrigger = React.forwardRef<HTMLButtonElement, DateRangePickerTriggerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const api = useDateRangePickerContext()
    const triggerProps = api.getTriggerProps() as React.ButtonHTMLAttributes<HTMLButtonElement>

    if (asChild) {
      const Comp = Slot
      return (
        <Comp
          ref={ref}
          data-slot="date-range-picker-trigger"
          className={cn(className)}
          {...triggerProps}
          {...props}
        />
      )
    }

    const mergedProps = mergeProps(
      triggerProps,
      props
    ) as React.ButtonHTMLAttributes<HTMLButtonElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <button
        ref={ref}
        type="button"
        data-slot="date-range-picker-trigger"
        className={cn(className, mergedClassName)}
        {...restProps}
      />
    )
  }
)
DateRangePickerTrigger.displayName = 'DateRangePickerTrigger'

const DateRangePickerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const api = useDateRangePickerContext()

    if (!api.open) return null

    const positionerProps = api.getPositionerProps() as React.HTMLAttributes<HTMLDivElement> & {
      style?: React.CSSProperties
    }
    const { style: positionerStyle, ...restPositionerProps } = positionerProps

    const mergedProps = mergeProps(api.getContentProps(), props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <Portal>
        <div
          {...restPositionerProps}
          style={{
            ...positionerStyle,
            zIndex: 50,
          }}
        >
          <div
            ref={ref}
            data-slot="date-range-picker-content"
            data-state="open"
            className={cn(mergedClassName, className)}
            {...restProps}
          >
            {children}
          </div>
        </div>
      </Portal>
    )
  }
)
DateRangePickerContent.displayName = 'DateRangePickerContent'

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent }
export type { DateRangePickerProps, DateRangePickerValue }
